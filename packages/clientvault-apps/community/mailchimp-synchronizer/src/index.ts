import axios from 'axios';
import {
  type DatabaseEventPayload,
  type FunctionConfig,
  type ObjectRecordCreateEvent,
  type ObjectRecordUpdateEvent,
} from 'clientvault-sdk';
import ClientVault, { type Person } from '../generated';

const MAILCHIMP_API_URL: string =
  process.env.MAILCHIMP_SERVER_PREFIX !== '' &&
  process.env.MAILCHIMP_SERVER_PREFIX !== undefined
    ? `https://${process.env.MAILCHIMP_SERVER_PREFIX}.api.mailchimp.com/3.0/`
    : '';
const MAILCHIMP_API_KEY: string = process.env.MAILCHIMP_API_KEY ?? '';
const MAILCHIMP_AUDIENCE_ID: string = process.env.MAILCHIMP_AUDIENCE_ID ?? '';
const IS_EMAIL_CONSTRAINT: boolean = process.env.IS_EMAIL_CONSTRAINT === 'true';
const IS_COMPANY_CONSTRAINT: boolean =
  process.env.COMPANY_CONSTRAINT === 'true';
const IS_PHONE_CONSTRAINT: boolean = process.env.IS_PHONE_CONSTRAINT === 'true';
const IS_ADDRESS_CONSTRAINT: boolean =
  process.env.IS_ADDRESS_CONSTRAINT === 'true';
const UPDATE_PERSON: boolean = process.env.UPDATE_PERSON === 'true';

type mailchimpAddress = {
  street1: string;
  street2: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
};

type mailchimpRecord = {
  id?: string;
  email_channel?: {
    email: string;
    marketing_consent?: {
      status: string;
    };
  };
  sms_channel?: {
    sms_phone: string;
    marketing_consent?: {
      status: string;
    };
  };
  mergeFields: {
    FNAME: string;
    LNAME: string;
    ADDRESS: string | mailchimpAddress;
    COMPANY: string;
    PHONE: string;
  };
};

type clientvaultAddress = {
  addressStreet1: string;
  addressStreet2: string;
  addressCity: string;
  addressState: string;
  addressPostCode: string;
  addressCountry: string;
};

type clientvaultCompany = {
  name: string;
  address: clientvaultAddress;
};

type clientvaultPerson = {
  name: {
    firstName: string;
    lastName: string;
  };
  emails: {
    primaryEmail: string;
  };
  phones: {
    primaryPhoneNumber: string;
    primaryPhoneCallingCode: string;
  };
  companyId: string | null;
};

type DatabaseEvent =
  | DatabaseEventPayload<ObjectRecordCreateEvent<Person>>
  | DatabaseEventPayload<ObjectRecordUpdateEvent<Person>>;

const fetchCompanyData = async (companyId: string): Promise<clientvaultCompany> => {
  const { company } = await new ClientVault().query({
    company: {
      __args: { filter: { id: { eq: companyId } } },
      name: true,
      address: {
        addressStreet1: true,
        addressStreet2: true,
        addressState: true,
        addressPostcode: true,
        addressCity: true,
        addressCountry: true,
      },
    },
  });
  return company as unknown as clientvaultCompany;
};

const checkAddress = (address: clientvaultAddress): mailchimpAddress => {
  if (
    address.addressStreet1 !== '' &&
    address.addressCity !== '' &&
    address.addressPostCode !== '' &&
    address.addressState !== ''
  ) {
    return {
      street1: address.addressStreet1,
      street2: address.addressStreet2,
      city: address.addressCity,
      state: address.addressState,
      zipCode: address.addressPostCode,
      country: address.addressCountry,
    } as mailchimpAddress;
  }
  throw new Error('Invalid address');
};

const checkAudiencePermissions = async (
  audienceId: string,
): Promise<string[] | undefined> => {
  const options = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${MAILCHIMP_API_KEY}`,
    },
    url: `${MAILCHIMP_API_URL}/audiences/${audienceId}`,
  };
  try {
    const temp = await axios.request(options);
    return temp.data.enabled_channels;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error;
    }
  }
};

const prepareData = (
  firstName: string,
  lastName: string,
  email: string,
  phoneNumber: string,
  phoneCallingCode: string,
  companyName: string,
  address: mailchimpAddress | string,
): mailchimpRecord => {
  let data = {
    mergeFields: {},
  } as mailchimpRecord;
  data.mergeFields.FNAME = firstName;
  data.mergeFields.LNAME = lastName;
  if (IS_EMAIL_CONSTRAINT) {
    data.email_channel = {
      email: email,
      marketing_consent: {
        status: 'unknown',
      },
    };
  }
  if (IS_ADDRESS_CONSTRAINT) {
    data.mergeFields.ADDRESS = address;
  }
  if (IS_PHONE_CONSTRAINT) {
    const mergedPhoneNumber: string = phoneCallingCode.startsWith('+')
      ? phoneCallingCode.concat(phoneNumber)
      : '+'.concat(phoneCallingCode, phoneNumber);
    data['sms_channel'] = {
      sms_phone: mergedPhoneNumber,
      marketing_consent: {
        status: 'unknown',
      },
    };
    data['mergeFields']['PHONE'] = mergedPhoneNumber;
  }
  if (IS_COMPANY_CONSTRAINT) {
    data['mergeFields']['COMPANY'] = companyName;
  }
  return data;
};

const addClientVaultPersonToMailchimp = async (
  convertedRecord: mailchimpRecord,
): Promise<boolean | undefined> => {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${MAILCHIMP_API_KEY}`,
    },
    url: `${MAILCHIMP_API_URL}/audiences/${MAILCHIMP_AUDIENCE_ID}/contacts`,
    data: convertedRecord,
  };
  try {
    const response = await axios.request(options);
    return response.status === 200;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error;
    }
  }
};

const checkIfClientVaultPersonExistsInMailchimp = async (
  email?: string,
  phoneNumber?: string,
  cursor?: string,
) => {
  const options = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${MAILCHIMP_API_KEY}`,
    },
    url: cursor
      ? `${MAILCHIMP_API_URL}/audiences/${MAILCHIMP_AUDIENCE_ID}/contacts?count%3D1000%26cursor%3D${cursor}`
      : `${MAILCHIMP_API_URL}/audiences/${MAILCHIMP_AUDIENCE_ID}/contacts?count%3D1000`,
  };
  try {
    const response = await axios.request(options);
    const doesPersonExist: mailchimpRecord | undefined =
      (response.data.contacts.find(
        (contact: any) => contact.email_channel.email === email,
      ) as mailchimpRecord) ||
      (response.data.contacts.find(
        (contact: any) => contact.sms_channel.sms_phone === phoneNumber,
      ) as mailchimpRecord);
    if (doesPersonExist !== undefined) {
      return doesPersonExist;
    }
    if (response.data.next_cursor === undefined) {
      return undefined;
    } else {
      await checkIfClientVaultPersonExistsInMailchimp(
        email,
        phoneNumber,
        response.data.next_cursor,
      );
    }
    return undefined;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error;
    }
  }
};

const compareTwoRecords = (
  object1: mailchimpRecord,
  object2: mailchimpRecord,
) => {
  return (
    object1.email_channel?.email === object2.email_channel?.email &&
    object1.sms_channel?.sms_phone === object2.sms_channel?.sms_phone &&
    object1.mergeFields.FNAME === object2.mergeFields.FNAME &&
    object1.mergeFields.LNAME === object2.mergeFields.LNAME &&
    object1.mergeFields.ADDRESS === object2.mergeFields.ADDRESS &&
    object1.mergeFields.COMPANY === object2.mergeFields.COMPANY
  );
};

const updateClientVaultPersonInMailchimp = async (
  mailchimpRecordId: string,
  clientvaultConvertedRecord: mailchimpRecord,
): Promise<boolean | undefined> => {
  const options = {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${MAILCHIMP_API_KEY}`,
      'Content-Type': 'application/json',
    },
    url: `${MAILCHIMP_API_URL}/audiences/${MAILCHIMP_AUDIENCE_ID}/contacts/${mailchimpRecordId}`,
    data: clientvaultConvertedRecord,
  };
  try {
    const response = await axios.request(options);
    return response.status === 200;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error;
    }
  }
};

export const main = async (
  params: DatabaseEvent,
): Promise<object | undefined> => {
  if (!IS_EMAIL_CONSTRAINT && !IS_PHONE_CONSTRAINT) {
    console.warn(
      'Function exited as there are no constraints to email nor phone number',
    );
    return {};
  }
  if (
    MAILCHIMP_API_URL === '' ||
    MAILCHIMP_API_KEY === '' ||
    MAILCHIMP_AUDIENCE_ID === ''
  ) {
    console.warn('Missing Mailchimp required parameters');
    return {};
  }

  try {
    const { properties } = params;
    const clientvaultRecord: clientvaultPerson = properties.after as clientvaultPerson;
    if (
      clientvaultRecord.name.firstName === '' ||
      clientvaultRecord.name.lastName === ''
    ) {
      throw new Error('First or last name is empty');
    }

    const audiencePermissions: string[] | undefined =
      await checkAudiencePermissions(MAILCHIMP_AUDIENCE_ID);

    if (
      IS_EMAIL_CONSTRAINT &&
      audiencePermissions?.includes('Email') &&
      clientvaultRecord.emails.primaryEmail === ''
    ) {
      throw new Error('Email is empty');
    }

    if (
      IS_PHONE_CONSTRAINT &&
      audiencePermissions?.includes('SMS') &&
      (clientvaultRecord.phones.primaryPhoneNumber === '' ||
        clientvaultRecord.phones.primaryPhoneCallingCode === '')
    ) {
      throw new Error('Phone number is empty');
    }

    let companyName: string = '';
    let address: mailchimpAddress | string = '';
    if (IS_COMPANY_CONSTRAINT) {
      if (clientvaultRecord.companyId === null) {
        throw new Error('Missing relation to company record');
      }
      const company: clientvaultCompany = await fetchCompanyData(
        clientvaultRecord.companyId,
      );
      companyName = company.name ?? ''; // either "" or name
      address = IS_ADDRESS_CONSTRAINT ? checkAddress(company.address) : '';
    }

    const clientvaultPersonToMailchimpRecord: mailchimpRecord = prepareData(
      clientvaultRecord.name.firstName,
      clientvaultRecord.name.lastName,
      clientvaultRecord.emails.primaryEmail,
      clientvaultRecord.phones.primaryPhoneNumber,
      clientvaultRecord.phones.primaryPhoneCallingCode,
      companyName,
      address,
    );
    console.log(clientvaultPersonToMailchimpRecord);

    const isClientVaultPersonInMailchimp: mailchimpRecord | undefined =
      await checkIfClientVaultPersonExistsInMailchimp(
        clientvaultRecord.emails.primaryEmail,
        clientvaultPersonToMailchimpRecord.sms_channel?.sms_phone,
      );
    if (isClientVaultPersonInMailchimp !== undefined) {
      console.log(
        `Person ${clientvaultRecord.name.firstName} ${clientvaultRecord.name.lastName} found in Mailchimp`,
      );
      if (UPDATE_PERSON) {
        if (
          !compareTwoRecords(
            isClientVaultPersonInMailchimp,
            clientvaultPersonToMailchimpRecord,
          ) &&
          isClientVaultPersonInMailchimp.id
        ) {
          const isClientVaultPersonUpdatedInMailchimp: boolean | undefined =
            await updateClientVaultPersonInMailchimp(
              isClientVaultPersonInMailchimp.id,
              clientvaultPersonToMailchimpRecord,
            );
          if (!isClientVaultPersonUpdatedInMailchimp) {
            throw new Error(
              `Person ${clientvaultRecord.name.firstName} ${clientvaultRecord.name.lastName} update in Mailchimp failed`,
            );
          } else {
            console.log(
              `Person ${clientvaultRecord.name.firstName} ${clientvaultRecord.name.lastName} update in Mailchimp succeeded`,
            );
          }
        } else {
          console.log(
            `Person ${clientvaultRecord.name.firstName} ${clientvaultRecord.name.lastName} wasn't updated in Mailchimp because they're the same`,
          );
        }
      } else {
        console.log(
          `Person ${clientvaultRecord.name.firstName} ${clientvaultRecord.name.lastName} wasn't updated in Mailchimp because UPDATE_PERSON is set to false`,
        );
      }
    } else {
      console.log(
        `${clientvaultRecord.name.firstName} ${clientvaultRecord.name.lastName} doesn't exist in Mailchimp, adding`,
      );
      const isClientVaultPersonAddedToMailchimp: boolean | undefined =
        await addClientVaultPersonToMailchimp(clientvaultPersonToMailchimpRecord);
      if (!isClientVaultPersonAddedToMailchimp) {
        throw new Error(
          `Adding ${clientvaultRecord.name.firstName} ${clientvaultRecord.name.lastName} person to Mailchimp failed`,
        );
      } else {
        console.log(
          `Person ${clientvaultRecord.name.firstName} ${clientvaultRecord.name.lastName} has been successfully added`,
        );
      }
    }
    return {};
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(error.response);
      return {};
    }
    console.error(error);
    return {};
  }
};

export const config: FunctionConfig = {
  universalIdentifier: '83319670-775b-4862-b133-5c353e594151',
  name: 'mailchimp-synchronizer',
  triggers: [
    {
      universalIdentifier: 'e627ff6f-0a0c-48b2-bdbb-31967489ec96',
      type: 'databaseEvent',
      eventName: 'person.created',
    },
    {
      universalIdentifier: '657ece26-4478-4408-a257-4e9e16cce279',
      type: 'databaseEvent',
      eventName: 'person.updated',
    },
  ],
};

import { type JSONContent } from 'clientvault-emails';

export const parseEmailBody = (body: string): JSONContent | string => {
  try {
    const json = JSON.parse(body);

    return json;
  } catch {
    return body;
  }
};

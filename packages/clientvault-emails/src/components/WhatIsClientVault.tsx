import { type I18n } from '@lingui/core';
import { MainText } from 'src/components/MainText';
import { SubTitle } from 'src/components/SubTitle';

type WhatIsClientVaultProps = {
  i18n: I18n;
};

export const WhatIsClientVault = ({ i18n }: WhatIsClientVaultProps) => {
  return (
    <>
      <SubTitle value={i18n._('What is ClientVault?')} />
      <MainText>
        {i18n._(
          "It's a CRM, a software to help businesses manage their customer data and relationships efficiently.",
        )}
      </MainText>
    </>
  );
};

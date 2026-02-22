import { extractDomainFromLink } from 'src/modules/contact-creation-manager/utils/extract-domain-from-link.util';

describe('extractDomainFromLink', () => {
  it('should extract domain from link', () => {
    const link = 'https://www.clientvault.com';
    const result = extractDomainFromLink(link);

    expect(result).toBe('clientvault.com');
  });

  it('should extract domain from link without www', () => {
    const link = 'https://clientvault.com';
    const result = extractDomainFromLink(link);

    expect(result).toBe('clientvault.com');
  });

  it('should extract domain from link without protocol', () => {
    const link = 'clientvault.com';
    const result = extractDomainFromLink(link);

    expect(result).toBe('clientvault.com');
  });

  it('should extract domain from link with path', () => {
    const link = 'https://clientvault.com/about';
    const result = extractDomainFromLink(link);

    expect(result).toBe('clientvault.com');
  });
});

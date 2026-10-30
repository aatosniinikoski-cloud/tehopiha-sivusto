// Build-time source of truth for company information.
export const companyDetails = {
  officialName: 'TehoPiha Tmi', displayName: 'TehoPiha', businessId: '3611223-1',
  industry: 'Maalausliike', email: 'tehopiha@gmail.com', phone: '045 122 7111',
  phoneHref: '+358451227111', locality: 'Klaukkala, Nurmijärvi',
  area: 'Nurmijärvi ja lähialueet', logo: '/images/tehopiha_logo_transparent.png',
};
export const publicCompany = {
  officialName: companyDetails.officialName, displayName: companyDetails.displayName,
  businessId: companyDetails.businessId, industry: companyDetails.industry,
  email: companyDetails.email, phone: companyDetails.phone, phoneHref: companyDetails.phoneHref,
  locality: companyDetails.locality, area: companyDetails.area, logo: companyDetails.logo,
};

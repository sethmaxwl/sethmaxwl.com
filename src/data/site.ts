const email = 'sethmaxwl@gmail.com';

export const site = {
  url: 'https://sethmaxwl.com',
  name: 'Seth Maxwell',
  defaultTitle: 'Seth Maxwell | Software Engineer',
  description:
    'Software engineer at Atlassian working on Bitbucket Cloud, frontend architecture, and developer tools.',
  email,
  person: {
    jobTitle: 'Software Engineer',
    organization: 'Atlassian',
  },
  links: {
    email: `mailto:${email}`,
    github: 'https://github.com/sethmaxwl',
    linkedin: 'https://linkedin.com/in/sethmaxwl/',
  },
  nav: [
    { label: 'Work', href: '/work/' },
    { label: 'Blog', href: '/blog/' },
    { label: 'Contact', href: '/contact/' },
  ],
  footerLinks: [
    { label: 'Email', href: 'mailto:sethmaxwl@gmail.com' },
    { label: 'LinkedIn', href: 'https://linkedin.com/in/sethmaxwl/' },
    { label: 'GitHub', href: 'https://github.com/sethmaxwl' },
  ],
} as const;

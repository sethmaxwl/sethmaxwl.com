const email = 'sethmaxwl@gmail.com';

const links = {
  email: `mailto:${email}`,
  github: 'https://github.com/sethmaxwl',
  linkedin: 'https://linkedin.com/in/sethmaxwl/',
} as const;

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
  links,
  nav: [
    { label: 'Work', href: '/work/' },
    { label: 'Blog', href: '/blog/' },
    { label: 'Contact', href: '/contact/' },
  ],
  footerLinks: [
    { label: 'Email', href: links.email },
    { label: 'LinkedIn', href: links.linkedin },
    { label: 'GitHub', href: links.github },
  ],
} as const;

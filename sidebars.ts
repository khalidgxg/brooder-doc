import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  // By default, Docusaurus generates a sidebar from the docs folder structure
  tutorialSidebar: [
    {
      type: 'category',
      label: 'Workflows',
      items: [
        {
          type: 'category',
          label: 'Auth',
          items: [
            'workflows/auth/registration',
            'workflows/auth/login-and-activation',
            'workflows/auth/password-management',
            'workflows/auth/account-management',
          ],
        },
        {
          type: 'category',
          label: 'Support',
          items: [
            'workflows/support/general',
            'workflows/support/locations',
            'workflows/support/categories-and-skills',
          ],
        },
        {
          type: 'category',
          label: 'Admin',
          items: [
            'workflows/admin/provider-management',
            'workflows/admin/skills-management',
            'workflows/admin/services-management',
            'workflows/admin/upgrades-management',
            'workflows/admin/wallets-management',
            'workflows/admin/withdrawal-requests-management',
          ],
        },
        {
          type: 'category',
          label: 'Shared',
          items: [
            'workflows/shared/service-order-flow',
            'workflows/shared/bank-accounts',
            'workflows/shared/orders-management',
            'workflows/shared/service-delivery-management',
            'workflows/shared/profile-management',
            'workflows/shared/reviews-management',
            'workflows/shared/services-management',
            'workflows/shared/skills-management',
            'workflows/shared/transactions',
            'workflows/shared/wallets',
            'workflows/shared/withdrawal-requests',
          ],
        },
        {
          type: 'category',
          label: 'Provider',
          items: [
            'workflows/provider/setup',
            'workflows/provider/profile-management',
            'workflows/provider/skill-management',
            'workflows/provider/service-management',
            'workflows/provider/review-management',
            'workflows/provider/customer-creation',
            'workflows/provider/provider-levels',
          ],
        },
        {
          type: 'category',
          label: 'Customer',
          items: [
            'workflows/customer/provider-interactions',
            'workflows/customer/service-discovery',
            'workflows/customer/order-management',
          ],
        },
      ],
    },
  ],

  // But you can create a sidebar manually
  /*
  tutorialSidebar: [
    'intro',
    'hello',
    {
      type: 'category',
      label: 'Tutorial',
      items: ['tutorial-basics/create-a-document'],
    },
  ],
   */
};

export default sidebars;

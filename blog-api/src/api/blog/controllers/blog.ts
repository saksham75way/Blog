/**
 * blog controller
 */

import { factories } from "@strapi/strapi";
const { createCoreController } = factories;

module.exports = createCoreController("api::blog.blog", ({ strapi }) => ({
  async create(ctx) {
    // Get the user from the JWT token (automatically set in ctx.state.user)
    const { id: userId } = ctx.state.user;

    // Merge the user id into the request body data
    ctx.request.body.data.user = userId;

    // Call the default core controller create method
    const response = await super.create(ctx);
    return response;
  },
}));

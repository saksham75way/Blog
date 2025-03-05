/**
 * comment controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::comment.comment", ({ strapi }) => ({
  async create(ctx) {
    // Ensure the user is authenticated
    if (!ctx.state.user) {
      return ctx.unauthorized(`You must be logged in to create a comment`);
    }

    // Extract the authenticated user's ID from the JWT token
    const { id: userId } = ctx.state.user;
    ctx.request.body.data.users_permissions_user = userId;

    // Automatically assign the blog id if it's available in the route parameters.
    // For example, if your route is defined as `/api/blogs/:blogId/comments`
    if (ctx.params.blogId) {
      ctx.request.body.data.blog = parseInt(ctx.params.blogId, 10);
    }
    // Otherwise, if the blog field is provided in the request body, it will be used as is.

    // Continue with the default create action
    const response = await super.create(ctx);
    return response;
  },
}));

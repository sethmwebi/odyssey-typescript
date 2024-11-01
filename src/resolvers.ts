import { validateFullAmenities } from "./helpers";
import { Resolvers } from "./types";

export const resolvers: Resolvers = {
  Query: {
    featuredListings: (_, __, { dataSources }) => {
      return dataSources.listingAPI.getFeaturedListings();
    },
    listing: (_, { id }, { dataSources }) => {
      return dataSources.listingAPI.getListing(id);
    },
  },
  Listing: {
    amenities: ({ id, amenities }, _, { dataSources }) => {
      return validateFullAmenities(amenities)
        ? amenities
        : dataSources.listingAPI.getAmenities(id);
    },
  },
  Mutation: {
    async createListing(_, { input }, { dataSources }) {
      try {
        const response = await dataSources.listingAPI.createListing(input);
        console.log(response);
        // everything succeeds with the mutation
        return {
          code: 200,
          success: true,
          message: "Listing successfully created!",
          listing: response,
        };
      } catch (error) {
        return {
          code: 500,
          success: false,
          message: `Something went wrong: ${error.extensions.response.body}`,
          listing: null,
        };
      }
    },
  },
};

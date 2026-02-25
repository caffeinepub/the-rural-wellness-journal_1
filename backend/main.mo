import Map "mo:core/Map";
import Order "mo:core/Order";
import List "mo:core/List";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Nat "mo:core/Nat";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User profile
  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Blog section
  public type BlogCategory = {
    #personalStory;
    #interview;
    #clinicalObservation;
  };

  public type BlogPost = {
    id : Nat;
    title : Text;
    body : Text;
    category : BlogCategory;
    publishedDate : Time.Time;
    featuredImageUrl : ?Text;
  };

  module BlogPost {
    public func compareByDateAsc(post1 : BlogPost, post2 : BlogPost) : Order.Order {
      if (post1.publishedDate < post2.publishedDate) { #less } else {
        #greater;
      };
    };
  };

  var nextBlogId = 1;
  let blogPosts = Map.empty<Nat, BlogPost>();

  // Admin-only: create blog post
  public shared ({ caller }) func createBlogPost(title : Text, body : Text, category : BlogCategory, featuredImageUrl : ?Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create blog posts");
    };

    let blogPost : BlogPost = {
      id = nextBlogId;
      title;
      body;
      category;
      publishedDate = Time.now();
      featuredImageUrl;
    };

    blogPosts.add(nextBlogId, blogPost);
    nextBlogId += 1;
    blogPost.id;
  };

  // Admin-only: update blog post
  public shared ({ caller }) func updateBlogPost(id : Nat, title : Text, body : Text, category : BlogCategory, featuredImageUrl : ?Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update blog posts");
    };

    switch (blogPosts.get(id)) {
      case (null) { Runtime.trap("Blog post not found") };
      case (?existing) {
        let updatedPost : BlogPost = {
          id;
          title;
          body;
          category;
          publishedDate = existing.publishedDate;
          featuredImageUrl;
        };
        blogPosts.add(id, updatedPost);
      };
    };
  };

  // Admin-only: delete blog post
  public shared ({ caller }) func deleteBlogPost(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete blog posts");
    };

    if (not blogPosts.containsKey(id)) {
      Runtime.trap("Blog post not found");
    };
    blogPosts.remove(id);
  };

  // Public read: get single blog post
  public query func getBlogPost(id : Nat) : async ?BlogPost {
    blogPosts.get(id);
  };

  // Public read: get all blog posts
  public query func getAllBlogPosts() : async [BlogPost] {
    blogPosts.values().toArray().sort(BlogPost.compareByDateAsc);
  };

  // Public read: get blog posts by category
  public query func getBlogPostsByCategory(category : BlogCategory) : async [BlogPost] {
    let filtered = List.empty<BlogPost>();
    for (post in blogPosts.values()) {
      if (post.category == category) {
        filtered.add(post);
      };
    };
    filtered.toArray();
  };

  // Portfolio section
  public type PortfolioItem = {
    id : Nat;
    title : Text;
    description : Text;
    imageUrls : [Text];
    location : Text;
  };

  module PortfolioItem {
    public func compareByTitleAsc(p1 : PortfolioItem, p2 : PortfolioItem) : Order.Order {
      Text.compare(p1.title, p2.title);
    };
  };

  var nextPortfolioId = 1;
  let portfolioItems = Map.empty<Nat, PortfolioItem>();

  // Admin-only: create portfolio item
  public shared ({ caller }) func createPortfolioItem(title : Text, description : Text, imageUrls : [Text], location : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create portfolio items");
    };

    let item : PortfolioItem = {
      id = nextPortfolioId;
      title;
      description;
      imageUrls;
      location;
    };

    portfolioItems.add(nextPortfolioId, item);
    nextPortfolioId += 1;
    item.id;
  };

  // Admin-only: update portfolio item
  public shared ({ caller }) func updatePortfolioItem(id : Nat, title : Text, description : Text, imageUrls : [Text], location : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update portfolio items");
    };

    switch (portfolioItems.get(id)) {
      case (null) { Runtime.trap("Portfolio item not found") };
      case (?_) {
        let updatedItem : PortfolioItem = {
          id;
          title;
          description;
          imageUrls;
          location;
        };
        portfolioItems.add(id, updatedItem);
      };
    };
  };

  // Admin-only: delete portfolio item
  public shared ({ caller }) func deletePortfolioItem(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete portfolio items");
    };

    if (not portfolioItems.containsKey(id)) {
      Runtime.trap("Portfolio item not found");
    };
    portfolioItems.remove(id);
  };

  // Public read: get single portfolio item
  public query func getPortfolioItem(id : Nat) : async ?PortfolioItem {
    portfolioItems.get(id);
  };

  // Public read: get all portfolio items
  public query func getAllPortfolioItems() : async [PortfolioItem] {
    portfolioItems.values().toArray().sort(PortfolioItem.compareByTitleAsc);
  };

  // Public read: stats
  public type BlogStats = {
    totalPosts : Nat;
    totalPortfolioItems : Nat;
    lastUpdated : Time.Time;
  };

  public query func getBlogStats() : async BlogStats {
    {
      totalPosts = blogPosts.size();
      totalPortfolioItems = portfolioItems.size();
      lastUpdated = Time.now();
    };
  };
};

import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface BlogPost {
    id: bigint;
    title: string;
    body: string;
    publishedDate: Time;
    featuredImageUrl?: string;
    category: BlogCategory;
}
export type Time = bigint;
export interface PortfolioItem {
    id: bigint;
    title: string;
    imageUrls: Array<string>;
    description: string;
    location: string;
}
export interface BlogStats {
    lastUpdated: Time;
    totalPortfolioItems: bigint;
    totalPosts: bigint;
}
export interface UserProfile {
    name: string;
}
export enum BlogCategory {
    clinicalObservation = "clinicalObservation",
    interview = "interview",
    personalStory = "personalStory"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createBlogPost(title: string, body: string, category: BlogCategory, featuredImageUrl: string | null): Promise<bigint>;
    createPortfolioItem(title: string, description: string, imageUrls: Array<string>, location: string): Promise<bigint>;
    deleteBlogPost(id: bigint): Promise<void>;
    deletePortfolioItem(id: bigint): Promise<void>;
    getAllBlogPosts(): Promise<Array<BlogPost>>;
    getAllPortfolioItems(): Promise<Array<PortfolioItem>>;
    getBlogPost(id: bigint): Promise<BlogPost | null>;
    getBlogPostsByCategory(category: BlogCategory): Promise<Array<BlogPost>>;
    getBlogStats(): Promise<BlogStats>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getPortfolioItem(id: bigint): Promise<PortfolioItem | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateBlogPost(id: bigint, title: string, body: string, category: BlogCategory, featuredImageUrl: string | null): Promise<void>;
    updatePortfolioItem(id: bigint, title: string, description: string, imageUrls: Array<string>, location: string): Promise<void>;
}

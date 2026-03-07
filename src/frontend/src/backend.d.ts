import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Lead {
    growthGoals: string;
    name: string;
    email: string;
    company: string;
    phone: string;
    monthlyRevenue: string;
    budgetRange: string;
}
export interface backendInterface {
    getAllLeads(): Promise<Array<Lead>>;
    getPageViewCount(): Promise<bigint>;
    incrementPageView(): Promise<void>;
    submitLead(name: string, company: string, email: string, phone: string, monthlyRevenue: string, budgetRange: string, growthGoals: string): Promise<void>;
}

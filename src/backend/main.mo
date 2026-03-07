import Map "mo:core/Map";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";

actor {
  type Lead = {
    name : Text;
    company : Text;
    email : Text;
    phone : Text;
    monthlyRevenue : Text;
    budgetRange : Text;
    growthGoals : Text;
  };

  module Lead {
    public func compareByName(lead1 : Lead, lead2 : Lead) : Order.Order {
      Text.compare(lead1.name, lead2.name);
    };
  };

  let leads = Map.empty<Principal, Lead>();
  var pageViewCounter = 0;

  public shared ({ caller }) func submitLead(name : Text, company : Text, email : Text, phone : Text, monthlyRevenue : Text, budgetRange : Text, growthGoals : Text) : async () {
    let lead : Lead = {
      name;
      company;
      email;
      phone;
      monthlyRevenue;
      budgetRange;
      growthGoals;
    };
    leads.add(caller, lead);
  };

  public query ({ caller }) func getAllLeads() : async [Lead] {
    leads.values().toArray().sort(Lead.compareByName);
  };

  public shared ({ caller }) func incrementPageView() : async () {
    pageViewCounter += 1;
  };

  public query ({ caller }) func getPageViewCount() : async Nat {
    pageViewCounter;
  };
};

// Time limit options per permit type
export const PERMIT_DURATIONS = {
  Residential: [
    { l: "3 Months", p: "$37.50" },
    { l: "6 Months", p: "$75" },
    { l: "1 Year", p: "$150" },
  ],
  Commercial: [
    { l: "1 Day", p: "$25" },
    { l: "1 Week", p: "$120" },
    { l: "1 Month", p: "$400" },
    { l: "3 Months", p: "$1,100" },
  ],
  Handicap: [
    { l: "1 Year", p: "Free" },
    { l: "2 Years", p: "Free" },
    { l: "Permanent", p: "Free" },
  ],
  "Visitor Parking": [
    { l: "1 Day", p: "$7" },
    { l: "3 Days", p: "$20" },
    { l: "7 Days", p: "$40" },
  ],
};

export const ZONES = [
  {
    id: "Zone A",
    name: "Zone A",
    desc: "Residential Parking",
    available: true,
    rate: "$150/yr",
    time: "Mon–Fri, 8AM–6PM",
  },
  {
    id: "Zone B",
    name: "Zone B",
    desc: "Commercial / Visitor",
    available: true,
    rate: "$4/hr",
    time: "Mon–Sat, 8AM–8PM",
  },
  {
    id: "Zone C",
    name: "Zone C",
    desc: "High Demand Area",
    available: false,
    rate: "$6.50/hr",
    time: "Daily, 24/7",
  },
];

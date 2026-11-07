/** Transcribed from user-supplied directors.png, partners.png and contact us.png. Images remain reference-only. */
export const company = {
  email: "luckycablenetwork1@gmail.com",
  website: "https://www.luckycablenetwork.com",
  cablePhone: "9512340080",
  broadbandPhone: "9512340930",
  nodalOfficer: "Ashik C Patel",
  nodalPhone: "9512340145",
  address: "SURVEY NO 234/2, KUND FALIA BHIMPORE, NANI DAMAN, Daman, Daman and Diu, 396210",
  gst: "26AAGFL0825L1Z9"
} as const;

export const directors = ["Mrs. Preeti Patel", "Mrs. Neeta Patel"] as const;

export const technologyPartners = [
  { category: "CAS & headend", description: "Technology behind access and distribution.", names: ["SUMAVISION", "NSTV (Novel Super TV)", "NAGRA", "CHANNEL MASTER", "DIGITAL HEADEND IP SOLUTION", "OPTILINK"], details: ["Sumavision Technologies Co. Ltd.", "", "", "Channel Master Pvt. Ltd.", "", "Optilink Network"] },
  { category: "Set-top box", description: "The connection between the network and your screen.", names: ["SKYWORTH", "PANODIC", "MYBOX", "KINGVON", "OVT"], details: ["Hong Kong Skyworth Digital Holdings Co., Ltd.", "", "", "", ""] },
  { category: "Subscriber management", description: "SMS partner for cable operations.", names: ["CableGuy CATV"], details: [""] }
] as const;

export const phoneHref = (phone: string) => `tel:+91${phone}`;
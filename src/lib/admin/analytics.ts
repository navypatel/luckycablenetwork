import { connectDatabase } from "./database";
import { Customer, Subscription, Invoice, Payment, Complaint, MsrReport, AdminAudit } from "./models";
export async function dashboardMetrics() {
  await connectDatabase();
  const [customers, subscriptions, invoices, payments, openComplaints, stagedReports, importedReports, recentAudit] = await Promise.all([
    Customer.countDocuments(), Subscription.countDocuments(), Invoice.countDocuments(), Payment.countDocuments({ reversedAt: { $exists: false } }),
    Complaint.countDocuments({ status: { $in: ["open", "in-progress"] } }), MsrReport.countDocuments({ status: "staged" }), MsrReport.countDocuments({ status: "imported" }),
    AdminAudit.find({}, "action target at").sort({ at: -1 }).limit(8).lean()
  ]);
  return { metrics: { customers, subscriptions, invoices, payments, openComplaints, stagedReports, importedReports }, recentAudit: recentAudit.map(record => ({ id: String(record._id), action: record.action, target: record.target, at: record.at })) };
}

import mongoose from "mongoose";

const { Schema, model } = mongoose;
  

const subscriptionSchema = new mongoose.Schema(
    {
        user : { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        plan : { type: mongoose.Schema.Types.ObjectId, ref: "Plan", required: true },
        startDate : { type: Date, default: Date.now },
        endDate : { type: Date },
        status : { type: String, enum: ["ACTIVE", "CANCELED"], default: "ACTIVE" },

    }
);

subscriptionSchema.methods.renew = async function() {
    const interval = this.plan.duration;
    const renewalDate = new Date(this.endDate);

    switch (interval) {
        case "week" :
            renewalDate.setDate(renewalDate.getDate() + 7);
            break;
        case "month" :
            renewalDate.setMonth(renewalDate.getMonth() + 1);
            break;    
    }
    this.startDate = new Date();
    this.endDate = renewalDate;
    await this.save();
}

const Subscription = model("Subscription", subscriptionSchema);
export default Subscription;
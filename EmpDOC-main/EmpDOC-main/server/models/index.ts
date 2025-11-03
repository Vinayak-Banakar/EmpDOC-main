import mongoose, { Schema, Types } from "mongoose";
import { experienceFromDate } from "../utils/experience";

export type Role = "HR" | "Employee";

export interface IUser {
  _id: Types.ObjectId;
  email: string;
  passwordHash: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["HR", "Employee"], required: true },
  },
  { timestamps: true }
);

export const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export interface IEmployee {
  _id: Types.ObjectId;
  owner: Types.ObjectId; // user who owns this record
  name: string;
  dateOfJoining: Date;
  salary: number;
  // Derived fields returned by API (virtuals)
  experienceMonths?: number;
  experienceYears?: number;
  avatar?: {
    data: Buffer;
    contentType: string;
    filename: string;
    size: number;
  } | null;
  createdAt: Date;
  updatedAt: Date;
}

const EmployeeSchema = new Schema<IEmployee>(
  {
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, required: true },
    dateOfJoining: { type: Date, required: true },
    salary: { type: Number, required: true, min: 0 },
    avatar: {
      data: Buffer,
      contentType: String,
      filename: String,
      size: Number,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

EmployeeSchema.virtual("experienceMonths").get(function (this: IEmployee) {
  return experienceFromDate(this.dateOfJoining).months;
});

EmployeeSchema.virtual("experienceYears").get(function (this: IEmployee) {
  return experienceFromDate(this.dateOfJoining).years;
});

export const Employee =
  mongoose.models.Employee || mongoose.model<IEmployee>("Employee", EmployeeSchema);

export interface IAuditLog {
  _id: Types.ObjectId;
  user: Types.ObjectId; // who performed the action
  action: "CREATE" | "READ" | "UPDATE" | "DELETE";
  targetType: "Employee" | "User";
  targetId: Types.ObjectId;
  meta?: Record<string, any>;
  createdAt: Date;
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    action: { type: String, enum: ["CREATE", "READ", "UPDATE", "DELETE"], required: true },
    targetType: { type: String, enum: ["Employee", "User"], required: true },
    targetId: { type: Schema.Types.ObjectId, required: true },
    meta: { type: Schema.Types.Mixed },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const AuditLog = mongoose.models.AuditLog || mongoose.model<IAuditLog>("AuditLog", AuditLogSchema);

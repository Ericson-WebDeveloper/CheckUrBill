import React from "react";
import { IGenericResponse } from "../models/response/Response";

// type TrackingProgressProps = {
//     token: string | null
// };

export interface batchJobsProgress {
  id: string;
  name: string;
  total_jobs: number;
  pendingJobs: number;
  processedJobs: number;
  progress: number;
  totalJobs: number;
  failedJobs: number;
  options: Array<unknown> | null;
  cancelledAt: number | Date | string | null;
  createdAt: number | Date | string;
  finishedAt: number | Date | string | null;
}

const TrackingProgress = (url: string, token: string) => {
  const hooksProgressJobs = async (batchId: string|number): Promise<IGenericResponse<batchJobsProgress>> => {
    let r = await fetch(`${url}${batchId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    let response: IGenericResponse<batchJobsProgress> = await r.json();
    return response;
  };
  return {
    hooksProgressJobs,
  };
};

export default TrackingProgress;

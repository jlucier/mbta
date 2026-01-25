import _ from "lodash";

const BASE_URL = "https://api-v3.mbta.com";
const API_KEY = import.meta.env.VITE_MBTA_API_KEY;

interface JsonApiItem<T> {
  id: string;
  attributes: T;
  relationships: {
    trip?: {
      data: {
        id: number;
      };
    };
  };
}

interface MBTAResponse<T> {
  data: T[];
}

interface PredictionAttrs {
  arrival_time: Date;
  departure_time: Date;
  arrival_uncertainty: number;
  departure_uncertainty: number;
  status: string | null;
  update_type: string;
}
export type Prediction = JsonApiItem<PredictionAttrs>;

interface ScheduleAttrs {
  arrival_time: Date;
  departure_time: Date;
}
export type Schedule = JsonApiItem<ScheduleAttrs>;

export function isPrediction(obj: any): obj is Prediction {
  return obj?.attributes?.arrival_uncertainty !== undefined;
}

export interface BaseFilters extends Record<string, string | undefined> {
  "filter[route]": string;
  "filter[stop]": string;
  "filter[direction_id]": string;
  sort?: string;
  "page[limit]"?: string;
}

export interface ScheduleFilters extends BaseFilters {
  "filter[date]"?: string;
  "filter[min_time]"?: string;
  "filter[max_time]"?: string;
  sort?: string;
}

function parseDates(obj: Record<string, unknown>) {
  return _.fromPairs(
    _.map(obj, (v, k) => [
      k,
      k === "arrival_time" || k === "departure_time" ? new Date(v as string) : v,
    ]),
  );
}

function baseParamsWith(extra: Record<string, string | undefined>) {
  const params = new URLSearchParams([["api_key", API_KEY]]);
  _.forEach(extra, (v, k) => {
    if (v) params.set(k, v);
  });
  return params;
}

export async function getSchedule(filters: ScheduleFilters) {
  const params = baseParamsWith(filters);
  const resp = await fetch(`${BASE_URL}/schedules?${params}`);
  if (!resp.ok) throw Error("Schedules request failed");
  const body = await resp.json();
  body.data = _.map(body.data, (d) => ({
    ...d,
    attributes: parseDates(d.attributes),
  }));
  return body as MBTAResponse<Schedule>;
}

export async function getPredictions(filters: BaseFilters) {
  const params = baseParamsWith(filters);
  const resp = await fetch(`${BASE_URL}/predictions?${params}`);
  if (!resp.ok) throw Error("Schedules request failed");

  const body = await resp.json();
  body.data = _.map(body.data, (d) => ({
    ...d,
    attributes: parseDates(d.attributes),
  }));
  return body as MBTAResponse<Prediction>;
}

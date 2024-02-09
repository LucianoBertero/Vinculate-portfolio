export interface EventPoints {
  coordinates: {
    lat: number;
    lng: number;
  };
  name: string;
  category: string;
  startDate: string;
  startTime: string;
  endTime: string;
  endDate: string;
  howToGet: string;
  description: string;
  requirements: string;
  maxPeople: number;
  uid: string;
}

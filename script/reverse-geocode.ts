import "dotenv/config";
import { LocationServiceProxy } from "../src/location-service";

const run = async () => {
  console.log("init...");

  const proxy = new LocationServiceProxy(
    !process.env.DISABLE_NOMINATIM,
    process.env.RAPIDAPI_API_KEY,
    process.env.LOCATIONIQ_API_KEY
  );

  console.log("running...");

  const resp = await proxy.reverseLocation({
    latitude: 53.83826,
    longitude: 20.5068895,
  });

  console.log(resp);
};

run().then().catch(console.error);

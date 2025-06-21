// Entry point for the app
import { Redirect } from "expo-router";

export default function Index() {
  // user is dericted to the home page since the login page is not completed
  return <Redirect href="/home" />;
  //return <Redirect href="/sign-up" />;
  //return <Redirect href="/log-in" />;
}

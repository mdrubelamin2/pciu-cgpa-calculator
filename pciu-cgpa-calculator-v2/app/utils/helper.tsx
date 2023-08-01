import axios from "axios";
import { parse } from "node-html-parser";
import { onlineResultAPI, trimesterResultAPI } from "./apisEndpoint";

const fetchDataFromURL = async (
  url: string,
  method: "GET" | "POST" = "GET",
  requestData: any = {}
) => {
  try {
    const options: any = {
      method,
      url,
    };

    if (method.toUpperCase() === "GET") {
      options.params = requestData;
    } else {
      options.data = requestData;
    }

    const response = await axios(options);
    return response.data;
  } catch (error: any) {
    throw new Error("Error fetching data from URL: " + error.message);
  }
};

const trimStr = (str: string) => {
  return str.replace(/[\n\r]+|[\s]{2,}/g, " ").trim();
};

const trimestersList = async () => {
  const response = await axios.get(trimesterResultAPI);
  const data = response.data;
  const root: any = parse(data);
  const trimesters = root.querySelectorAll("#semester option");
  const trimestersList: string[] = [];

  trimesters.forEach((trimester: any) => {
    const optValue = trimStr(
      trimester.rawAttrs.split("value=")[1].split('"')[1]
    );
    if (!optValue) return;
    trimestersList.unshift(optValue);
  });
  //console.log({ trimestersList });

  return trimestersList;
};

const currentPublishedResultSemester = async () => {
  const resp = await axios.get(onlineResultAPI);
  const respData = resp.data;
  const root: any = parse(respData);

  // const requestVerificationToken = root
  //   .querySelector("form")
  //   .firstChild.getAttribute("value");
  const semester = root.querySelector("#Semester").rawAttributes.Value;

  console.log({ semester });
};

export {
  fetchDataFromURL,
  trimStr,
  trimestersList,
  currentPublishedResultSemester,
};

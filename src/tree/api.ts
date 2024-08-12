import axios from "axios";

const API_KEY = "$2a$10$jcX3l7lYql07dk/HQ/xER.tYQMgOKxa6vXxBjkdomF4sIoCGrEEBS";
const BIN_ID = "66566919e41b4d34e4fb08cf";

export const getTreeData = async () => {
  const response = await axios.get(
    `https://api.jsonbin.io/v3/b/${BIN_ID}/latest`,
    {
      headers: {
        "X-Master-Key": API_KEY,
      },
    }
  );
  return response.data.record;
};

export const saveTreeData = async (data: any) => {
  await axios.put(`https://api.jsonbin.io/v3/b/${BIN_ID}`, data, {
    headers: {
      "Content-Type": "application/json",
      "X-Master-Key": API_KEY,
    },
  });
};
import { createEffect, createEvent, createStore, sample } from "effector";
import axios from "axios";

type DadataRequest = {
  query: string;
};

type DadataResponse = {
  suggestions: Array<{
    value: string;
    data: {
      address?: {
        value?: string;
      };
      inn?: string;
      kpp?: string;
      ogrn?: string;
      okved?: string;
    };
  }>;
};

export const fetchCompanyDataFx = createEffect(
  async (params: DadataRequest) => {
    const API_KEY = "4f61fe13cd6409adafe321eb01320b287a7ff995";
    const response = await axios.post<DadataResponse>(
      "https://suggestions.dadata.ru/suggestions/api/4_1/rs/findById/party",
      { query: params.query },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Token ${API_KEY}`,
        },
      },
    );

    if (response.data.suggestions.length === 0) {
      throw new Error("Компания не найдена");
    }

    return response.data.suggestions[0];
  },
);

export const $companyData = createStore<{
  suggestionValue?: string;
  address?: string;
  inn?: string;
  kpp?: string;
  ogrn?: string;
  okved?: string;
} | null>(null);

export const $isLoading = createStore<boolean>(false);

export const clearCompanyData = createEvent();

$companyData
  .on(fetchCompanyDataFx.doneData, (_, payload) => ({
    suggestionValue: payload.value,
    address: payload.data.address?.value,
    inn: payload.data.inn,
    kpp: payload.data.kpp,
    ogrn: payload.data.ogrn,
    okved: payload.data.okved,
  }))
  .on(clearCompanyData, () => null);

$isLoading
  .on(fetchCompanyDataFx, () => true)
  .on(fetchCompanyDataFx.finally, () => false);

sample({
  clock: fetchCompanyDataFx.failData,
  fn: (error) => {
    console.error("Ошибка при запросе к Dadata:", error);
    return error.message;
  },
});

import { useStore } from "effector-react";
import { $companyData } from "../api/dadata";

export const CompanyDataDisplay = () => {
  const companyData = useStore($companyData);

  if (!companyData) {
    return null;
  }

  return (
    <div className="mt-10">
      <p>
        <strong>Название:</strong> {companyData.suggestionValue}
      </p>
      <p>
        <strong>Адрес:</strong> {companyData.address}
      </p>
      <p>
        <strong>ИНН:</strong> {companyData.inn}
      </p>
      <p>
        <strong>КПП:</strong> {companyData.kpp}
      </p>
      <p>
        <strong>ОГРН:</strong> {companyData.ogrn}
      </p>
      <p>
        <strong>ОКВЭД:</strong> {companyData.okved}
      </p>
    </div>
  );
};

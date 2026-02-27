import { Form, Input, Button, message, Spin } from "antd";
import { MaskedInput } from "antd-mask-input";
import {
  legalEntityFormSchema,
  type LegalEntityFormData,
} from "../lib/shemas/LegalEntityShemas";
import { createSchemaFieldRule } from "antd-zod";
import React from "react";
import { clearCompanyData, fetchCompanyDataFx } from "../api/dadata";
import { useStore } from "effector-react";
import { $isLoading } from "../api/dadata";
import { CompanyDataDisplay } from "./CompanyDataDisplay";

const formContent = [
  { name: "name", label: "Имя контактного лица" },
  { name: "email", label: "Email" },
  { name: "password", label: "Пароль", type: "password" },
  {
    name: "phone",
    label: "Номер телефона",
    mask: "+7 (000) 000-00-00",
  },
  { name: "inn", label: "ИНН" },
];

export const LegalEntityForm = () => {
  const [form] = Form.useForm();
  const zodRule = createSchemaFieldRule(legalEntityFormSchema);
  const isLoading = useStore($isLoading);

  const [submittable, setSubmittable] = React.useState(false);
  const values = Form.useWatch([], form);

  React.useEffect(() => {
    form
      .validateFields({ validateOnly: true })
      .then(() => setSubmittable(true))
      .catch(() => setSubmittable(false));
  }, [form, values]);

  const onFinish = async (values: LegalEntityFormData) => {
    try {
      clearCompanyData();
      const companyData = await fetchCompanyDataFx({ query: values.inn });
      console.log("Данные пользователя:", values);
      console.log("Данные компании:", companyData);
      message.success("Данные компании успешно загружены!");
    } catch (error) {
      console.error("Произошла ошибка:", error);
      message.error("Ошибка: Компания не найдена или произошла ошибка.");
    }
  };

  return (
    <Spin
      spinning={isLoading}
      tip="Запрос выполняется..."
      className="flex flex-col items-center w-full px-4"
    >
      <Form
        form={form}
        layout="horizontal"
        onFinish={onFinish}
        labelAlign="left"
        labelCol={{ span: 12 }}
        wrapperCol={{ span: 14 }}
        className="md:min-w-[500px]  mx-auto p-4"
      >
        <h2 className="text-xl font-bold mb-4 pt-15">
          Регистрация физического лица
        </h2>

        <div className="">
          {formContent.map(({ name, label, type, mask }) => (
            <Form.Item
              key={name}
              name={name}
              label={label}
              layout="horizontal"
              required
              rules={[zodRule]}
              className="mb-4"
            >
              {mask ? (
                <MaskedInput
                  mask={mask}
                  status={form.getFieldError(name).length > 0 ? "error" : ""}
                  className="w-full"
                />
              ) : type === "password" ? (
                <Input.Password type={type} className="w-full" />
              ) : (
                <Input type={type} className="w-full" />
              )}
            </Form.Item>
          ))}
        </div>

        <Button
          type="primary"
          htmlType="submit"
          block
          className="!rounded-full h-10"
          disabled={!submittable || isLoading}
        >
          Зарегистрироваться
        </Button>
      </Form>
      <CompanyDataDisplay />
    </Spin>
  );
};

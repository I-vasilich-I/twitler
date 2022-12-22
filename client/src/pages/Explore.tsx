import { Input, Layout, Radio, Form, Card, RadioChangeEvent } from "antd";
import { useState } from "react";
import People from "../components/People/People";
import Tweets from "../components/Tweets/Tweets";
import { APIS } from "../constants";
import RadioButton from "../elements/RadioButton/RadioButton";
import { FilterTypes } from "../types";

const radioButtons = Object.values(FilterTypes);

const Explore = () => {
  const [form] = Form.useForm();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterTypes>(FilterTypes.TOP);
  const queryStr = `/${query}?filter=${filter}`;

  const url = `${APIS.EXPLORE}${query ? queryStr : ""}`;
  const isFilterByPeople = filter === FilterTypes.PEOPLE;

  const handleSearch = (value: string) => {
    setQuery(value);
  };

  const handleFilter = (e: RadioChangeEvent) => {
    setFilter(e.target.value);
  };

  return (
    <Layout
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 20,
      }}
    >
      <Card style={{ maxWidth: "825px", width: "100%" }}>
        <Form
          form={form}
          style={{ width: "100%", display: "flex", flexDirection: "column", gap: 10, alignItems: "center" }}
        >
          <Form.Item style={{ margin: 0, width: "100%" }}>
            <Input.Search placeholder="Search" enterButton="Search" onSearch={handleSearch} />
          </Form.Item>
          {query ? (
            <Form.Item style={{ margin: 0 }}>
              <Radio.Group defaultValue={filter} onChange={handleFilter}>
                {radioButtons.map((value) => (
                  <RadioButton value={value} key={value} />
                ))}
              </Radio.Group>
            </Form.Item>
          ) : null}
        </Form>
      </Card>
      {query && isFilterByPeople ? <People url={url} /> : <Tweets url={url} />}
    </Layout>
  );
};

export default Explore;

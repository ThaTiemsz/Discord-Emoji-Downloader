import React, { useState } from "react"
import { Button, Form, Notification, Progress } from "react-bulma-components"
import { SelectMenu } from "./SelectMenu"

export default function Default(props) {
  const selectOptions = [{
    label: "Static",
    options: [
      { value: "AniTroll", id: "706295582834163744" },
      { value: "blobthinkingeyes", id: "658678492187328522" },
      { value: "HanReally", id: "706295378412044438" },
      { value: "SpideyWTF", id: "600016839535493149" },
    ],
  }, {
    label: "Animated",
    options: [
      { value: "eyeshaking", id: "586008144606396418", animated: true },
      { value: "wazfast", id: "762455802241482783", animated: true },
      { value: "tiemen", id: "799338046356193301", animated: true },
    ],
  }]

  const [selected, setSelected] = useState([])

  function onSelect(values: any[]) {
    setSelected(values)
  }

  return (
    <>
      <Notification color="warning" p={3} mb={5}>
        <p><strong>CAUTION: This tool uses your Discord user token. Use it at your own risk.</strong></p>
        Your user token will only be used to fetch your server list, which includes emojis and stickers, and is not stored or used in any other way.
        You can&nbsp;
        <a href="https://github.com/ThaTiemsz/Discord-Emoji-Downloader" target="_blank">
           view the source here
        </a>.
      </Notification>

      <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Delectus assumenda doloremque vero placeat minus ducimus labore iste magnam id distinctio provident, mollitia hic doloribus odit fuga non excepturi maiores laudantium?</p>

      <Form.Label>Mode</Form.Label>
      <Form.Field kind="group">
        <Form.Control>
          <Button color="dark">
            User Token
          </Button>
        </Form.Control>
        <Form.Control>
          <Button color="dark">
            Guild Object
          </Button>
        </Form.Control>
      </Form.Field>

      <Form.Field>
        <Form.Label>Enter user token</Form.Label>
        <Form.Control>
          <Form.Input
            type="password"
            placeholder="mfa.ABcd1e2Fgh3i-jKlmnoPQRstu4VWx4yz5A6b7cDEFGhiJk8LmNOPqR_sSTUV9XyzabcdeF0XdQw4w9WgXcQ"
            autoComplete="off"
            colorVariant="dark"
          />
        </Form.Control>
      </Form.Field>

      <Form.Field>
        <Form.Label>Guild object</Form.Label>
        <Form.Control>
          <Form.Textarea colorVariant="dark" />
        </Form.Control>
      </Form.Field>

      <Form.Field>
        <Form.Label>
          Select emojis ({selected.length}/{selectOptions.reduce((sum, o) => sum + o.options.length, 0)})
        </Form.Label>
        <Form.Control>
          <SelectMenu
            options={selectOptions}
            defaultValue={[selectOptions[0].options[0]]}
            onChange={onSelect}
          />
        </Form.Control>
      </Form.Field>

      <Progress
        color="dark"
        size="small"
        max={90}
        value={70}
      />
    </>
  )
}
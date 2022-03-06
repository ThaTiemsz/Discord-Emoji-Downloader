import React, { useState } from "react"
import { Box, Button, Container, Heading, Icon, Level, Tabs } from "react-bulma-components"
import Default from "./Default"
import Manual from "./Manual"

import "../style.sass"

enum TabType {
  DEFAULT,
  MANUAL,
}

export default function App() {
  const [active, setActive] = useState<TabType>(TabType.DEFAULT)

  return (
    <Container p={3} pt={6} max={false}>
      <Box backgroundColor="brand">
        <Level>
          <Level.Side>
            <Level.Item>
              <Heading textColor="white">Discord Emoji & Sticker Downloader</Heading>
            </Level.Item>
          </Level.Side>
          <Level.Side align="right">
            <Level.Item>
              <Button
                color="brand"
                renderAs="a"
                href="https://github.com/ThaTiemsz/Discord-Emoji-Downloader"
                target="_blank"
              >
                <Icon size="large">
                  <span className="fa-brands fa-github"></span>
                </Icon>
                <span>View source</span>
              </Button>
            </Level.Item>
          </Level.Side>
        </Level>

        <Tabs>
          <Tabs.Tab onClick={() => setActive(TabType.DEFAULT)} active={active === TabType.DEFAULT}>
            With user token
          </Tabs.Tab>
          <Tabs.Tab onClick={() => setActive(TabType.MANUAL)} active={active === TabType.MANUAL}>
            Manual request
          </Tabs.Tab>
        </Tabs>

        <Container>
          { active === TabType.MANUAL
            ? <Manual />
            : <Default /> }
        </Container>
      </Box>
    </Container>
  )
}
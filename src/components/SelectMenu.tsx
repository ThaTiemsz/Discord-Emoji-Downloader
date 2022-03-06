import React from "react"
import { Image } from "react-bulma-components"
import Select, { type StylesConfig } from "react-select"
import { BRAND_COLOR, DARK_COLOR, DARK_COLOR_RGBA, TEXT_COLOR } from "../constants"

export function SelectMenu({ options, defaultValue, onChange }) {
  const customStyles: StylesConfig = {
    control: (styles, state) => ({
      ...styles,
      backgroundColor: DARK_COLOR,
      borderColor: DARK_COLOR,
      borderTopRightRadius: state.isFocused ? 0 : null,
      borderTopLeftRadius: state.isFocused ? 0 : null,
      boxShadow: "0 0 0 0.125em rgb(54 54 54 / 25%)",
      ":hover": {
        borderColor: DARK_COLOR,
      },
    }),
    input: (styles) => ({
      ...styles,
      color: TEXT_COLOR,
    }),
    indicatorSeparator: (styles) => ({
      ...styles,
      backgroundColor: DARK_COLOR_RGBA,
    }),
    menu: (styles) => ({
      ...styles,
      // borderTopLeftRadius: 0,
      // borderTopRightRadius: 0,
      margin: 0,
    }),
    menuList: (styles) => ({
      ...styles,
      padding: 0,
    }),
    group: (styles) => ({
      ...styles,
      backgroundColor: DARK_COLOR_RGBA,
      margin: 0,
      padding: 2,
    }),
    option: (styles, state) => ({
      ...styles,
      backgroundColor: state.isFocused ? DARK_COLOR_RGBA : DARK_COLOR,
      color: TEXT_COLOR,
      ":hover": {
        backgroundColor: DARK_COLOR_RGBA,
      },
    }),
    multiValue: (styles) => ({
      ...styles,
      backgroundColor: BRAND_COLOR,
      color: TEXT_COLOR,
    }),
    multiValueLabel: (styles) => ({
      ...styles,
      color: TEXT_COLOR,
      paddingRight: 6,
    }),
    multiValueRemove: (styles) => ({
      ...styles,
      "> svg": {
        width: 15,
        height: 15,
      },
      ":hover": {
        backgroundColor: DARK_COLOR_RGBA,
      },
    }),
  }

  return (
    <Select
      isMulti
      menuPlacement="top"
      styles={customStyles}
      options={options}
      defaultValue={defaultValue}
      closeMenuOnSelect={false}
      onChange={onChange}
      formatOptionLabel={(option: any) => (
        <div className="selectOption">
          <Image
            className="selectImage"
            alt={option.value}
            src={`https://cdn.discordapp.com/emojis/${option.id}.${option.animated ? "gif" : "png"}?size=32`}
            size={32}
            fullwidth={false}
          />
          <span className="selectLabel">{option.value}</span>
        </div>
      )} />
  )
}

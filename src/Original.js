import React, {useEffect, useState } from 'react'
import Select from 'react-select';
import "./styles.css";
import _, { isArray } from "lodash";
import data from "./colordata.json"
import countryDropdown from "./mids.json" 

const Original = () => {
  const multiColorPalette = [
    "#ffa500",
    "#ffff00",
    "#00ff00",
    "#00fa9a",
    "#0000ff",
    "#ff00ff",
    "#2f4f4f",
    "#800000",
    "#006400",
    "#ffc0cb",
    "#4b0082",
    "#48d1cc",
    "#ff0000",
    "#f0e68c",
    "#6495ed",
    "#7f0000"
  ]

  const bluePaletteEight = [
    "#F0F8FF",
    "#B0E0E6",
    "#87CEEB",
    "#87CEFA",
    "#B0C4DE",
    "#89CFF0",
    "#6495ED",
    "#0000CD"
  ];
    const bluePalette = [
        "#F0F8FF",
        "#B0E0E6",
        "#87CEEB",
        "#87CEFA",
        "#B0C4DE",
        "#89CFF0",
        "#6495ED",
        "#0000CD",
        "#1E90FF",
        "#4169E1",
        "#000080",
        "#00008B",
        "#191970",
        "#000066",
        "#4B0082",
        "#000033"
      ];
    
      const redShadesHexCodes = [
        "#FFA07A",
        "#FFDAB9",
        "#F08080",
        "#FF6F61",
        "#FF6347",
        "#FF4D00",
        "#D32F2F",
        "#CD5C5C",
        "#B22222",
        "#8B0000",
        "#800000",
        "#800020",
        "#8B0000",
        "#990000",
        "#C04000",
        "#660000"
      ];
    
      const greenShadesHexCodes = [
        "#B0E57C",
        "#8EDD65",
        "#70D45D",
        "#4CC16C",
        "#2EBD8B",
        "#00B894",
        "#00A896",
        "#00876D",
        "#006C5B",
        "#005A52",
        "#004D40",
        "#003D33",
        "#002E20",
        "#00231B",
        "#001612",
        "#000C09"
      ];
    
      const yellowPalette = [
        "#FFFFE0",
        "#FFFF99",
        "#FFFACD",
        "#FFFACD",
        "#FFFF00",
        "#FFFF66",
        "#FDFD96",
        "#FFFDD0",
        "#FBEC5D",
        "#FFD700",
        "#DAA520",
        "#F4C430",
        "#FFBF00",
        "#B8860B",
        "#FFDB58",
        "#FFD700"
      ];
    
      const combinedPalettes = [
        {paletteName: "MultiColor", colors: multiColorPalette},
        { paletteName: "Blue", colors: bluePalette },
        { paletteName: "Red", colors: redShadesHexCodes },
        { paletteName: "Green", colors: greenShadesHexCodes },
        { paletteName: "Yellow", colors: yellowPalette },
        { paletteName: "BlueEight", colors: bluePaletteEight }
      ];
    
      const colorOptions = [
        { value: "ShipType", label: "Ship Type" },
        { value: "Source", label: "Source" },
        { value: "VesselClass", label: "Vessel Class" },
        { value: "Speed", label: "Speed" },
        { value: "flag_code", label: "Country" },
        { value: "cog", label: "Course" },
        { value: "navigation_status", label: "Navigation Status" },
        { value: "latency", label: "Latency" },
        { value: "time_dark", label: "Time Dark" }
      ];
      const continuousValues = ["cog", "Speed", "latency", "time_dark"]


      const [attributeSelected, setAttributeSelected] = useState(colorOptions[0])
      const objectIndexToUpdate = data.findIndex(obj => obj.iconColorSetBy === attributeSelected.value)
      const [updatedData, setUpdatedData] = useState(data[objectIndexToUpdate])
      const [selectedPalette, setSelectedPalette] = useState(combinedPalettes[0])
      const [continuous, setContinuous] = useState(false)
      const [mappedVal, setMappedVal] = useState(_.cloneDeep(updatedData.mapping));
      const [dropdownOp, setDropdownOP] = useState([])
      const [dropdownByAttr, setDropdownByAttr] = useState(null)
      const [dropdownOpForRange, setDropdownOpForRange] = useState([])
      const [countryPossibleVal, setCountryPossibleVal] = useState(0)
      const [countryDropdownOp, setCountryDropdownOp] = useState([])

    
      const paletteOptions = combinedPalettes.map((palette) => ({
        value: palette,
        label: palette.paletteName
      }));

      function getValuesForDropdown(array1, array2, rangeDropDown, valueToRemove) {
        // converting countryDropdown(mids.json) to array of objects 
      const result = Object.entries(countryDropdown).map(item => ({value:item[0] , label: item[1][3]}))
      if (updatedData.iconColorSetBy === "flag_code") {array1 = result}
      const updatedDataVal = array1.map(item => item.label ? item.label : Object.values(item))
      const splicedVal = array2.map(item => Object.values(item))
      const dropdownOp = _.difference(updatedDataVal.flat(2), splicedVal.flat(2))
      dropdownOpForRange.push(valueToRemove)
      rangeDropDown ? setDropdownOP(dropdownOpForRange) : setDropdownOP(dropdownOp)
      rangeDropDown ? setDropdownByAttr({
        ...dropdownByAttr,
        [attributeSelected.value] : dropdownOpForRange
      }) : setDropdownByAttr({
        ...dropdownByAttr,
        [attributeSelected.value] : [...new Set(dropdownOp)]
      })
      }

    
      const handleChangeIconColor = (value) => {
        const objectIndexToUpdate = data.findIndex(obj => obj.iconColorSetBy === value.value)
        if (data[objectIndexToUpdate].iconColorSetBy === "flag_code") setCountryPossibleVal(countryPossibleVal +  1)
        setUpdatedData(data[objectIndexToUpdate])
        setMappedVal(data[objectIndexToUpdate].mapping)
        const result = continuousValues.filter(item => item === data[objectIndexToUpdate].iconColorSetBy)
        result.length === 0 ? setContinuous(false) : setContinuous(true)
        setAttributeSelected(value)
        setDropdownByAttr({
          ...dropdownByAttr,
          [attributeSelected.value] : []
        })
        setDropdownOpForRange([])
        console.log(result, "result check")
        if (result.length !== 0) setSelectedPalette(combinedPalettes[1])
        else setSelectedPalette(combinedPalettes[0])
      }

      const handlePaletteChange = (selectedPalette) => {
        setSelectedPalette(selectedPalette)
        const palette = selectedPalette.colors
        const updatedMapping = updatedData.mapping.map((item, index) => {
          const keys = Object.keys(item)
          const newKey = palette[index]
      
          const newItem = {
            [newKey]: item[keys[0]],
          }
          return newItem
        })
        const splicedArray = [...updatedMapping]
        if (palette.length <= 8) {
          splicedArray.splice(palette.length)
          setMappedVal(splicedArray)
          getValuesForDropdown(updatedData.mapping, splicedArray)
        }else {
          setMappedVal(updatedMapping)
          splicedArray.splice(palette.length)
          setMappedVal(splicedArray)
          getValuesForDropdown(updatedData.mapping, splicedArray)
        }
      }
    
      const formatOptionLabel = ({ value }) => (
        <div>
          <div className="colorSwatches">
            {value.colors.map((color, colorIndex) => (
              <div
                key={colorIndex}
                className="colorSwatches"
                style={{ backgroundColor: color, height: "20px", width: "20px" }}
              ></div>
            ))}
          </div>
        </div>
      );
    
     const handleChange = (selectedOption, e, color) => {
      let array = true
      let rangeDropDown = false

      // updating mapping when value is removed from select box
      const mappedValCopy = _.cloneDeep(mappedVal);
      const mappedValCopyForRange = _.cloneDeep(mappedVal)
      if (e.action === "remove-value") {
        const valueToRemove = e.removedValue.value;
        mappedValCopy.forEach(item => {
        for (const key in item) {
          const obj = item[key] 
          const labelToCheckRemoved = Array.isArray(item[key])? null : obj === null ? null : obj.min === null ? `< ${obj.max} mins` : obj.max === null ? `> ${obj.min} mins` :`${obj.min} to ${obj.max} mins`
          if(labelToCheckRemoved === valueToRemove) rangeDropDown =  true
          item[key] = Array.isArray(item[key])? item[key].filter(val => val !== valueToRemove) : labelToCheckRemoved === valueToRemove ? null : item[key];
        }
      });

      // separate copy for range values -> speed, course, time-dark, latency
      mappedValCopyForRange.forEach(item => {
        for (const key in item) {
          const obj = item[key]
          if(Array.isArray(item[key]) === false) array = false
          const labelToCheckRemoved = Array.isArray(item[key])? null :obj === null ? null : obj.min === null ? `< ${obj.max} mins` : obj.max === null ? `> ${obj.min} mins` :`${obj.min} to ${obj.max} mins`
          const labelForContinuous = Array.isArray(item[key])? null : obj === null ? null : obj.min === null ? `< ${obj.max}` : obj.max === null ? `> ${obj.min}` :`${obj.min} - ${obj.max}` 
          if(labelToCheckRemoved === valueToRemove) rangeDropDown =  true
          item[key] = Array.isArray(item[key])? item[key].filter(val => val !== valueToRemove) : labelToCheckRemoved === valueToRemove ? null : labelForContinuous;
        }
      });
        setMappedVal(mappedValCopy);
        array ? getValuesForDropdown(updatedData.possibleValues, mappedValCopy, rangeDropDown, valueToRemove): getValuesForDropdown(updatedData.possibleValues, mappedValCopyForRange, rangeDropDown, valueToRemove)
      }


    // updating mapping when option is removed from select box dropdown
      if (e.action === "select-option") {
        const valueToAdd = e.option.value;
        mappedValCopy.forEach(item => {
        for (const key in item) {
          if (key === color.toString()) item[key].push(valueToAdd)
        }
      });
        setMappedVal(mappedValCopy);
        getValuesForDropdown(updatedData.possibleValues, mappedValCopy)
      }
      }

      
      // GETTING DROPDOWN OPTIONS FOR COUNTRY FROM MIDS.JSON
      useEffect(()=> {
        Object.entries(countryDropdown).map(item => countryDropdownOp.push(item[1][3]))

        // Object.values(countryDropdown).map(item => console.log(item[3], "country label"))
        if(updatedData.iconColorSetBy === "flag_code")  {
          const mappingFlagCode = updatedData.mapping.map(item => Object.values(item)).flat(2)
          setDropdownByAttr({
          ...dropdownByAttr,
          [attributeSelected.value] : [...new Set (_.difference(countryDropdownOp, mappingFlagCode))]
        })
      }
      }, [countryPossibleVal])
    
      return (
        <div className="App">
          <div className="attr-color-palette">
            <Select
              options={colorOptions}
              value={attributeSelected}
              onChange={(value) => handleChangeIconColor(value)}
            />
    
            <Select
              options={paletteOptions}
              formatOptionLabel={formatOptionLabel}
              value={{ value: selectedPalette, label: selectedPalette.paletteName }}
              onChange={(selectedPalette) =>
                handlePaletteChange(selectedPalette.value)
              }
            />
            <div>
            {continuous === false ? mappedVal.map((item, index) => (
            <div key={index} className="wrapper-color-select">
            <div
              style={{
                height: "30px",
                width: "30px",
                margin: "2px",
                backgroundColor: Object.keys(item)
              }}
            ></div>
            <Select
            className='selectbox-legend'
              options={dropdownByAttr !== null ? dropdownByAttr[attributeSelected.value]?.map(legend => {
                if (legend === null  || legend === undefined) return ""
                return ({ value: legend, label: legend })
              }) :  []
              }
              value = {Object.values(item).map(legend => legend.map(val =>({value: val, label: val})))[0]}
              isMulti
              onChange={(selectedOption, e) => {handleChange(selectedOption, e, Object.keys(item))}}
            />
            </div>
        )) : mappedVal.map((item, index) => (
          <div key={index} className="wrapper-color-select">
          <div
            style={{
              height: "20px",
              width: "20px",
              margin: "2px",
              backgroundColor: Object.keys(item)
            }}
          ></div>
          {Object.values(item).map(obj => (
            <div className='continuous-values'>
              <Select 
              className='selectbox-legend'
              isMulti
              options={dropdownByAttr !== null ? dropdownByAttr[attributeSelected.value]?.map(legend => {
                if (legend === null  || legend === undefined) return ""
                return ({ value: legend, label: legend })
              }) :  []
              }
              value ={obj === null ? null : obj.min === null ? {value: `< ${obj.max} mins`, label:`< ${obj.max} mins`} : obj.max === null ? {value:`> ${obj.min} mins` , label: `> ${obj.min} mins`} :{value:`${obj.min} to ${obj.max} mins`, label:`${obj.min} to ${obj.max} mins`} }
              onChange={(selectedOption, e) => {handleChange(selectedOption, e, Object.keys(item))}}
              />
          </div>
          ))}
          
          </div>
      )) }
        </div>
          </div>
        </div>
      );
}

export default Original

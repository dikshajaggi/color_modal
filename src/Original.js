import React, {useEffect, useState } from 'react'
import Select from 'react-select';
import "./styles.css";
import _, { isArray } from "lodash";
import data from "./colordata.json"
import countryDropdown from "./mids.json" 
import dataFromApi from "./color.json"

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
      const selectedValRange = _.cloneDeep(updatedData.mapping)
      const [possibleVal, setPossibleVal] = useState(data[objectIndexToUpdate].possibleValues);
      const [dropdownOp, setDropdownOP] = useState([])
      const [dropdownByAttr, setDropdownByAttr] = useState(null)
      const [dropdownOpForRange, setDropdownOpForRange] = useState([])
      const [countryPossibleVal, setCountryPossibleVal] = useState(0)
      const [countryDropdownOp, setCountryDropdownOp] = useState([])


      const paletteOptions = combinedPalettes.map((palette) => ({
        value: palette,
        label: palette.paletteName
      }));

      function getValuesForDropdown(array1, array2) {
      console.log(array1, "checking array 1 array 2 for dropdown ", array2)
      const checkingRange = continuousValues.filter(item => item === data[objectIndexToUpdate].iconColorSetBy).length === 0

      // converting countryDropdown(mids.json) to array of objects 
      const result = Object.entries(countryDropdown).map(item => ({value:item[0] , label: item[1][3]}))
      if (updatedData.iconColorSetBy === "flag_code") {array1 = result}

      // dropdown options for ship type, vessel class, source, navigation_status, country
      const updatedDataVal = array1.map(item => item.label)
      const splicedVal = array2.map(item => Object.values(item)).flat(2)
      const dropdownOp = _.difference(updatedDataVal.flat(2), splicedVal)


      // getting dropdown op for range values (cog, sog, time-dark, latency)
      const updatedDatValRange = checkingRange ? null : array1.map(item => item.value)
      const splicedValRange = checkingRange ? null : array2.map(item => {
        const data = Object.values(item)
        return data[0]?.value
      })
      const dropdownRangeVal = checkingRange ? null : _.difference(updatedDatValRange, splicedValRange.filter(val => val !== undefined))
      const dropdownRangeLabel = []
      if(checkingRange === false) array1.filter(item => {
        if (dropdownRangeVal.includes(item.value)) dropdownRangeLabel.push(item.label)
      })
      setDropdownOpForRange(dropdownRangeLabel)

      // setting values of dropdown 
      checkingRange ? setDropdownOP(dropdownOp) : setDropdownOP(dropdownRangeLabel)
      checkingRange ? setDropdownByAttr({
        ...dropdownByAttr,
        [attributeSelected.value] : [...new Set(dropdownOp)]
      }) :  setDropdownByAttr({
          ...dropdownByAttr,
          [attributeSelected.value] : dropdownRangeLabel
        })
    }

    
      const handleChangeIconColor = (value) => {
        const objectIndexToUpdate = data.findIndex(obj => obj.iconColorSetBy === value.value)
        if (data[objectIndexToUpdate].iconColorSetBy === "flag_code") setCountryPossibleVal(countryPossibleVal +  1)
        setUpdatedData(data[objectIndexToUpdate])
        setMappedVal(data[objectIndexToUpdate].mapping)
        setPossibleVal(data[objectIndexToUpdate].possibleValues)
        const result = continuousValues.filter(item => item === data[objectIndexToUpdate].iconColorSetBy)
        result.length === 0 ? setContinuous(false) : setContinuous(true)
        setAttributeSelected(value)
        setDropdownByAttr({
          ...dropdownByAttr,
          [attributeSelected.value] : []
        })
        setDropdownOpForRange([])
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
          getValuesForDropdown(updatedData.possibleValues, splicedArray)
        }else {
          console.log(updatedMapping, "handle palette change",splicedArray, updatedData.mapping)

          setMappedVal(updatedMapping)
          splicedArray.splice(palette.length)
          setMappedVal(splicedArray)
          getValuesForDropdown(updatedData.possibleValues, splicedArray)
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

      function findValueByLabel(labelToFind) {
        for (const item of data[objectIndexToUpdate].possibleValues) {
          if (item.label === labelToFind) {
            return item.value;
          }
        }
        return null;
      }

      function findObjectWithMatchingValue(value, obj) {
        console.log(obj, "checking266")
        // for (const item of data[objectIndexToUpdate].mapping) {
        //   console.log(item, "checking item")
        //   const obj = Object.values(item)
        //   for (const i  in obj) {
        //     console.log(obj, obj[i].value, "checking ob")
        //     if (obj[i].value === value) {
        //       return obj[i].value;
        //     }
        //   }
        // }
        // return null;
        if (obj !== null){
          if (obj.value === value) return value
        }
        return null
      }

      function findObjectWithMatchingValueSelected (value) {
        for (const item of dataFromApi[objectIndexToUpdate].mapping) {
          console.log(item, "checking item")
          const obj = Object.values(item)
          for (const i  in obj) {
            console.log(obj, "checking ob")
            if (obj[i].value === value) {
              console.log(obj, obj[i].value, "checking ob")
              return obj[i];
            }
          }
        }
        return null;
      }
      
    
     const handleChange = (e, color) => {
      const mappedValCopy = _.cloneDeep(mappedVal);

      // updating mapping when value is removed from select box
      if (e.action === "remove-value") {
        const valueToRemove = e.removedValue.value;
        const value = findValueByLabel(valueToRemove)
        mappedValCopy.forEach((item, index) => {
        for (const key in item) {
          console.log(item[key], "checking 285", value)
          // const labelToCheckRemoved = Array.isArray(item[key])? null : obj === null ? null : obj.value === possibleVal[index]?.value ? possibleVal[index].label : null
          // console.log(obj, labelToCheckRemoved === valueToRemove, labelToCheckRemoved, valueToRemove, possibleVal[index]?.value, "checking value to remove")

          item[key] = Array.isArray(item[key])? item[key].filter(val => val !== valueToRemove) : value === findObjectWithMatchingValue(value, item[key]) ? null : item[key] ;
        }
      });
      console.log(mappedValCopy, "mappedValCopy")
        setMappedVal(mappedValCopy);
        getValuesForDropdown(updatedData.possibleValues, mappedValCopy)
      }

      // updating mapping when option is removed from select box dropdown
      if (e.action === "select-option") {
        const value = findValueByLabel(e.option.value)
        console.log("checking func", value)
        // const indexForContinuousVal = data[objectIndexToUpdate].possibleValues.findIndex(val => val.label === e.option.value)
        const result = continuousValues.filter(item => item === data[objectIndexToUpdate].iconColorSetBy).length === 0
        // Object.values(data[objectIndexToUpdate].mapping[indexForContinuousVal])[0]
        const valueSelected = findValueByLabel(e.option.value)
        
        mappedValCopy.forEach(item => {
        for (const key in item) {
          if (key === color.toString() && result ) item[key].push(e.option.value)
          else if (key === color.toString() ) {
          console.log(findObjectWithMatchingValueSelected(valueSelected), valueSelected, item[key], key, item, "findObjectWithMatchingValue(value, item[key], true)")
            item[key] = findObjectWithMatchingValueSelected(valueSelected)
          }
        }
      });
        setMappedVal(mappedValCopy);
        getValuesForDropdown(updatedData.possibleValues, mappedValCopy)
      }
      }

      
      // GETTING DROPDOWN OPTIONS FOR COUNTRY FROM MIDS.JSON
      useEffect(()=> {
        Object.entries(countryDropdown).map(item => countryDropdownOp.push(item[1][3]))
        if(updatedData.iconColorSetBy === "flag_code")  {
          const mappingFlagCode = updatedData.mapping.map(item => Object.values(item)).flat(2)
          setDropdownByAttr({
          ...dropdownByAttr,
          [attributeSelected.value] : [...new Set (_.difference(countryDropdownOp, mappingFlagCode))]
        })
      }
      }, [countryPossibleVal])

      const applyChanges = () => {
        // data[objectIndexToUpdate].mapping = mappedVal
        updatedData.mapping = mappedVal 
      }
    
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
              onChange={(selectedOption, e) => {handleChange(e, Object.keys(item))}}
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
               {possibleVal.map(item => {
                if(item.value === obj?.value) console.log(item.label, obj?.value, "checking values")
              })}
              <Select 
              className='selectbox-legend'
              isMulti
              options={dropdownByAttr !== null ? dropdownByAttr[attributeSelected.value]?.map(legend => {
                if (legend === null  || legend === undefined) return ""
                return ({ value: legend, label: legend })
              }) :  []
              }
              value ={obj === null ? null : possibleVal.map(item => {
                if(item.value === obj?.value) return ({ value: item.label, label: item.label })
              })}
              onChange={(selectedOption, e) => {handleChange(e, Object.keys(item))}}
              />
          </div>
          ))}
          
          </div>
      )) }
        </div>
          </div>
          <div className='btn-wrapper'>
            <button onClick={applyChanges}>Apply</button>
            <button>Save</button>
          </div>
        </div>
      );
}

export default Original

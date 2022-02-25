import * as C from "color"

const normalizeColor = (value:number) => (value * 255) / 1

const makeFills = (fills) => {
  if (fills.length) {
    let values = []
    fills.forEach(fill => {
      if (fill.visible) {
        if (fill.type === "SOLID") {
          values.push(
            `linear-gradient(
              rgba(${fill.color.r * 255}, ${fill.color.g * 255}, ${fill.color.b * 255}, ${fill.opacity}),
              rgba(${fill.color.r * 255}, ${fill.color.g * 255}, ${fill.color.b * 255}, ${fill.opacity}))`
          );
        }
        // todo: gradients, image fills
      }
    });
    return values.reverse().join(", ")
  } else {
    return "none"
  }
}

const makeRadii = (tl, tr, bl, br) => {
  return `${tl}px ${tr}px ${br}px ${bl}px`
}

const makeBorder = (strokes, strokeWeight, dashPattern) => {
  if (strokes.length) {
    // Only do the first border
    // Not sure how this might display multiple borders, mabye refactor w/ box shadow??
    // But in that case we can't do dashed style
    let borderStyle = dashPattern && dashPattern.length ? "dashed" : "solid"
    return `${strokeWeight}px ${borderStyle} rgba(${strokes[0].color.r * 255},${strokes[0].color.g * 255}, ${strokes[0].color.b * 255}, ${strokes[0].opacity})`
  } else {
    return "none"
  }
}

export const StyleSample = ({styles}) => {
  // console.log("STYLES", styles)

  const {
    fills,
    strokes,
    strokeWeight,
    dashPattern,
    topLeftRadius,
    topRightRadius,
    bottomLeftRadius,
    bottomRightRadius,
    effects,
    blendMode
  } = styles

  const css = {
    backgroundImage: makeFills(fills),
    borderRadius: makeRadii(topLeftRadius, topRightRadius, bottomLeftRadius, bottomRightRadius),
    border: makeBorder(strokes, strokeWeight, dashPattern)
  }

  //console.log("css", css)

  return (
    <div style={css} className="mr-1 w-7 h-7 test"></div>
  )
}

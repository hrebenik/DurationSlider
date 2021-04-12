import React, { useCallback, useMemo } from 'react';
import types from 'prop-types';
import { fromMinutes } from 'pomeranian-durations';

import { makeStyles, Slider } from '@material-ui/core';

import { iso8601type } from 'constants/customTypes';

import DurationLabel from './DurationLabel';
import useDuration from './useDuration.hook';

const useSliderStyles = makeStyles({
  valueLabel: {
    backgroundColor: 'green',
  },
});

const DurationSlider = (props) => {
  const {
    marks,
    onChange,
    max: initMax,
    min: initMin,
    onChangeCommitted,
    value: initValue,
    valueLabelDisplay,
    defaultValue: initDefaultValue,
  } = props;

  const sliderClasses = useSliderStyles();
  const { isoToMinutes, minutesToIso } = useDuration();

  const max = useMemo(() => isoToMinutes(initMax), [isoToMinutes, initMax]);
  const min = useMemo(() => isoToMinutes(initMin), [isoToMinutes, initMin]);
  const value = useMemo(() => isoToMinutes(initValue), [isoToMinutes, initValue]);
  const defaultValue = useMemo(() => (
    isoToMinutes(initDefaultValue)
  ), [isoToMinutes, initDefaultValue]);

  const handleChange = useCallback((e, newValue) => {
    onChange(minutesToIso(newValue));
  }, [onChange, minutesToIso]);

  return (
    <Slider
      min={min}
      max={max}
      value={value}
      marks={marks}
      classes={sliderClasses}
      onChange={handleChange}
      defaultValue={defaultValue}
      valueLabelFormat={minutesToIso}
      ValueLabelComponent={DurationLabel}
      onChangeCommitted={onChangeCommitted}
      valueLabelDisplay={valueLabelDisplay}
    />
  );
};
export const propTypes = {
  onChange: types.func.isRequired,
  max: iso8601type,
  min: iso8601type,
  value: iso8601type,
  defaultValue: iso8601type,
  onChangeCommitted: types.func,
  valueLabelDisplay: types.oneOf(['auto', 'off', 'on']),
  marks: types.arrayOf(
    types.shape({
      value: types.number.isRequired,
      label: types.string.isRequired,
    }),
  ),
};
export const defaultProps = {
  marks: undefined,
  min: fromMinutes(0),
  max: fromMinutes(60),
  value: fromMinutes(0),
  valueLabelDisplay: 'auto',
  onChangeCommitted: undefined,
  defaultValue: fromMinutes(0),
};

DurationSlider.propTypes = propTypes;
DurationSlider.defaultProps = defaultProps;

export default DurationSlider;

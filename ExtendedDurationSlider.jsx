import React, {
  useRef,
  useMemo,
  useState,
  useCallback,
  useEffect,
} from 'react';

import cx from 'classnames';
import { toFragments } from 'pomeranian-durations';

import {
  Box,
  Collapse,
  IconButton,
  makeStyles,
} from '@material-ui/core';

import ExpandIcon from '@material-ui/icons/ExpandMore';

import RegularInput from 'components/RegularInput/RegularInput';

import { has } from 'services/helpers';
import useNestedTranslation from 'services/i18next/useNestedTranslation.hook';

import DurationSlider, {
  propTypes as dsPropTypes,
  defaultProps as dsDefaultProps,
} from './DurationSlider';

import useDuration from './useDuration.hook';

const useStyles = makeStyles({
  sliderRow: {
    display: 'flex',
    flexWrap: 'nowrap',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  sliderContainer: {
    flexGrow: '1',
    padding: '10px 20px',
  },
  expandIcon: {
    transitionDuration: '250ms',
    transitionProperty: 'transform',
    transform: 'rotate(0deg)',
    '&$open': {
      transitionDuration: '250ms',
      transform: 'rotate(180deg)',
    },
  },
  open: {},
  inputSection: {
    display: 'flex',
    padding: '0 15px',
    flexWrap: 'nowrap',
    justifyContent: 'space-between',
    '& > *': {
      margin: '10px',
      flexGrow: '1',
    },
  },
});

const ExtendedDurationSlider = (props) => {
  const {
    value,
    onChange,
    min: initMin,
    max: initMax,
    onChangeCommitted,
    ...rest
  } = props;

  const t = useNestedTranslation('components.durationSlider');
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [fieldValues, setFieldValues] = useState('');
  const { minutesToIso, isoToMinutes } = useDuration();

  const daysRef = useRef(null);
  const hoursRef = useRef(null);
  const minutesRef = useRef(null);

  const calcMinutes = useCallback((v) => {
    const f = toFragments(v);
    const result = [];

    if (has(f, 'days')) {
      result.push((Number.parseFloat(f.days) || 0) * 24 * 60);
    }
    if (has(f, 'hours')) {
      result.push((Number.parseFloat(f.hours) || 0) * 24);
    }
    if (has(f, 'minutes')) {
      result.push(Number.parseFloat(f.minutes) || 0);
    }
    return result.reduce((r, n) => r + n, 0);
  }, []);

  const fragments = useMemo(() => toFragments(fieldValues), [fieldValues]);
  const min = useMemo(() => calcMinutes(initMin), [initMin, calcMinutes]);
  const max = useMemo(() => calcMinutes(initMax), [initMax, calcMinutes]);

  const expandIconClasses = cx(
    classes.expandIcon,
    open && classes.open,
  );

  const handleChangeCommitted = useCallback((...args) => {
    setFieldValues(value);

    if (typeof onChangeCommitted === 'function' && args.length) {
      onChangeCommitted(...args);
    }
  }, [setFieldValues, onChangeCommitted, value]);

  useEffect(() => {
    if (min && isoToMinutes(fieldValues) < min) {
      setFieldValues(minutesToIso(min));
    }
  }, [min, isoToMinutes, minutesToIso, fieldValues, setFieldValues]);

  const handleFieldsChange = useCallback(() => {
    const currentDays = Number.parseInt(daysRef.current.value, 10);
    const currentHours = Number.parseInt(hoursRef.current.value, 10);
    const currentMinutes = Number.parseInt(minutesRef.current.value, 10);
    const totalMinutes = (currentDays * 60 * 24) + (currentHours * 60) + currentMinutes;
    const tmMin = totalMinutes < min ? min : totalMinutes;
    const tmMax = tmMin > max ? max : tmMin;
    const newValue = minutesToIso(tmMax);
    setFieldValues(newValue);
    onChange(newValue);
  }, [setFieldValues, onChange, minutesToIso, daysRef, hoursRef, minutesRef, min, max]);

  const toggleExpand = useCallback(() => {
    if (!fieldValues) {
      handleChangeCommitted();
    }
    setOpen(!open);
  }, [fieldValues, handleChangeCommitted, setOpen, open]);

  return (
    <Box>
      <Box className={classes.sliderRow}>
        <Box className={classes.sliderContainer}>
          <DurationSlider
            min={initMin}
            max={initMax}
            value={value}
            onChange={onChange}
            onChangeCommitted={handleChangeCommitted}
            {...rest} // eslint-disable-line
          />
        </Box>
        <IconButton onClick={toggleExpand} className={expandIconClasses}>
          <ExpandIcon />
        </IconButton>
      </Box>
      <Collapse in={open}>
        <Box className={classes.inputSection}>
          <Box>
            <RegularInput
              max={5}
              min={0}
              fullWidth
              type="number"
              inputRef={daysRef}
              value={fragments.days || 0}
              onChange={handleFieldsChange}
              label={t('fields.extended.days.label')}
            />
          </Box>
          <Box>
            <RegularInput
              min={0}
              max={24}
              fullWidth
              type="number"
              inputRef={hoursRef}
              value={fragments.hours || 0}
              onChange={handleFieldsChange}
              label={t('fields.extended.hours.label')}
            />
          </Box>
          <Box>
            <RegularInput
              min={0}
              max={60}
              fullWidth
              type="number"
              inputRef={minutesRef}
              onChange={handleFieldsChange}
              value={fragments.minutes || 0}
              label={t('fields.extended.minutes.label')}
            />
          </Box>
        </Box>
      </Collapse>
    </Box>
  );
};
export const propTypes = {
  min: dsPropTypes.min,
  max: dsPropTypes.max,
  value: dsPropTypes.value,
  onChange: dsPropTypes.onChange,
  onChangeCommitted: dsPropTypes.onChangeCommitted,
};
export const defaultProps = {
  min: dsDefaultProps.min,
  max: dsDefaultProps.max,
  value: dsDefaultProps.value,
  onChange: dsDefaultProps.onChange,
  onChangeCommitted: dsDefaultProps.onChangeCommitted,
};

ExtendedDurationSlider.propTypes = propTypes;
ExtendedDurationSlider.defaultProps = defaultProps;

export default ExtendedDurationSlider;

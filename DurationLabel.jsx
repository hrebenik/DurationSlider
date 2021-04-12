import React from 'react';
import types from 'prop-types';
import { toFragments } from 'pomeranian-durations';

import { Tooltip } from '@material-ui/core';

import { iso8601type } from 'constants/customTypes';
import useNestedTranslation from 'services/i18next/useNestedTranslation.hook';

const labelKeys = ['years', 'months', 'weeks', 'days', 'hours', 'minutes'];

const DurationLabel = (props) => {
  const { open, value, children } = props;

  const t = useNestedTranslation('components.durationSlider');

  const fragments = toFragments(value);
  const result = [];

  labelKeys.forEach((label) => {
    if (fragments[label]) {
      result.push(t(`tooltip.${label}.label`, { count: fragments[label] }));
    }
  });
  return (
    <Tooltip
      open={open}
      placement="top"
      title={result.join(' ')}
    >
      {children}
    </Tooltip>
  );
};
DurationLabel.propTypes = {
  value: iso8601type,
  open: types.bool.isRequired,
  children: types.element.isRequired,
};
DurationLabel.defaultProps = {
  value: '',
};

export default DurationLabel;

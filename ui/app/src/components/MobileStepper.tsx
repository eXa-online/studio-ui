import React, { ReactNode } from 'react';
import clsx from 'clsx';
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import Paper from "@material-ui/core/Paper";
import { capitalize } from "@material-ui/core/utils";
import { LinearProgress } from "@material-ui/core";
import { withStyles } from '@material-ui/core/styles';


export const styles = (theme: Theme) => ({
  /* Styles applied to the root element. */
  root: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: theme.palette.background.default,
    padding: 8,
  },
  /* Styles applied to the root element if `position="bottom"`. */
  positionBottom: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: theme.zIndex.mobileStepper,
  },
  /* Styles applied to the root element if `position="top"`. */
  positionTop: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: theme.zIndex.mobileStepper,
  },
  /* Styles applied to the root element if `position="static"`. */
  positionStatic: {},
  /* Styles applied to the dots container if `variant="dots"`. */
  dots: {
    display: 'flex',
    flexDirection: 'row',
  },
  /* Styles applied to each dot if `variant="dots"`. */
  dot: {
    backgroundColor: theme.palette.action.disabled,
    borderRadius: '50%',
    width: 8,
    height: 8,
    margin: '0 2px',
  },
  /* Styles applied to a dot if `variant="dots"` and this is the active step. */
  dotActive: {
    backgroundColor: theme.palette.primary.main,
  },
  /* Styles applied to the Linear Progress component if `variant="progress"`. */
  progress: {
    width: '50%',
  },
});

const MobileStepper = React.forwardRef(function MobileStepper(props:MobileStepper, ref) {
  const {
    activeStep = 0,
    backButton,
    onDotClick,
    classes,
    className,
    LinearProgressProps,
    nextButton,
    position = 'bottom',
    steps,
    variant = 'dots',
    ...other
  } = props;

  return (
    <Paper
      square
      elevation={0}
      className={clsx(classes.root, classes[`position${capitalize(position)}`], className)}
      ref={ref}
      {...other}
    >
      {backButton}
      {variant === 'text' && (
        <React.Fragment>
          {activeStep + 1} / {steps}
        </React.Fragment>
      )}
      {variant === 'dots' && (
        <div className={classes.dots}>
          {[...new Array(steps)].map((_, index) => (
            <div
              key={index}
              onClick={onDotClick? (e) => onDotClick(e, index) : null}
              className={clsx(classes.dot, {
                [classes.dotActive]: index === activeStep,
              })}
            />
          ))}
        </div>
      )}
      {variant === 'progress' && (
        <LinearProgress
          className={classes.progress}
          variant="determinate"
          value={Math.ceil((activeStep / (steps - 1)) * 100)}
          {...LinearProgressProps}
        />
      )}
      {nextButton}
    </Paper>
  );
});

interface  MobileStepper {
  activeStep?: number,
  backButton?: ReactNode,
  onDotClick?: Function,
  classes: any,
  className?: string,
  LinearProgressProps?: any,
  nextButton?: ReactNode,
  position?: 'bottom' | 'top' | 'static',
  steps: number,
  variant: 'text' |'dots' | 'progress'
}

// @ts-ignore
export default withStyles(styles, { name: 'MuiMobileStepper' })(MobileStepper);

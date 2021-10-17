import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import { rpc } from '../../shared/lib/features';

const EntityCreate: React.FunctionComponent = ({ wsClient }) => {
  const defaultValues = {
    methodName: rpc[0],
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(formValues);
  };

  const [formValues, setFormValues] = useState(defaultValues);

  return (
    <form onSubmit={handleSubmit}>
      <Grid container alignItems='center' justify='center' direction='column'>
        <Grid item>
          <FormControl>
            <Select name='methodName' value={formValues.methodName} onChange={handleInputChange}>
              {rpc.map((method) => (
                <MenuItem key={method} value={method}>
                  {method}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button variant='contained' color='primary' type='submit'>
            Submit
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default EntityCreate;

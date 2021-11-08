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

const getRPCByMethodName = (methodName) => {
  const featureName = Object.keys(rpc).find((featureName) => {
    if (!rpc || !rpc[featureName] || !rpc[featureName].args) return false;
    return rpc[featureName] ? rpc[featureName].args.find(({ name }) => name === methodName) : false;
  });
  if (!rpc[featureName]) return false;
  console.log(rpc[featureName].args, 'MethodName', methodName);
  return rpc[featureName].args.find(({ name }) => name === methodName);
};

const EntityCreate: React.FunctionComponent = ({ wsClient, onSubmit }) => {
  const rpcNames = Object.keys(rpc);
  const defaultValues = {
    methodName: rpcNames[0],
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    //const { pack, unpack } = getRPCByMethodName(name) || { pack: (x) => x, unpack: (x) => x };
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(formValues);
  };

  const [formValues, setFormValues] = useState(defaultValues);
  const { methodName } = formValues;

  return (
    <form onSubmit={handleSubmit}>
      <Grid container alignItems='center' justify='center' direction='column'>
        <Grid item>
          <FormControl>
            <Select name='methodName' value={formValues.methodName} onChange={handleInputChange}>
              {rpcNames.map((method) => (
                <MenuItem key={method} value={method}>
                  {method}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        {methodName
          ? (() => {
              const { args } = rpc[methodName];
              return args
                ? args.map(({ name, type }) => (
                    <Grid item key={name}>
                      {type === 'json' ? (
                        <TextField
                          id='outlined-multiline-flexible'
                          name={name}
                          label={name}
                          multiline
                          maxrows={8}
                          value={formValues[name]}
                          onChange={handleInputChange}
                        />
                      ) : (
                        ''
                      )}

                      {type === 'number' ? (
                        <TextField
                          id='outlined-number'
                          label={name}
                          name={name}
                          value={formValues[name]}
                          onChange={handleInputChange}
                          type='number'
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      ) : (
                        ''
                      )}
                    </Grid>
                  ))
                : '';
            })()
          : ''}
        <Grid item>
          <Button variant='contained' color='primary' type='submit'>
            Submit
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default EntityCreate;

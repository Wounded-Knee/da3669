import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Slider from '@material-ui/core/Slider';
import Button from '@material-ui/core/Button';
import { store } from '../../ReduxStore';
import { QuasiBoolean } from '../../../shared/lib/Entities';

const defaultValues = {
  mother: 0,
  motherQbool: 0,
  comment: '',
  question: '',
  ifyes: '',
  ifno: '',
};

export const Form = (props) => {
  const { preview, entity, onSubmit } = props;
  const [formValues, setFormValues] = useState({
    ...defaultValues,
    mother: entity.id,
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(formValues, event);
  };

  store.subscribe(() =>
    console.log('Latest Entity: ', JSON.stringify(store.getState().entities[store.getState().entities.length - 1])),
  );

  const handleSliderChange = (name) => (e, value) => {
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const previewEntity = QuasiBoolean(
    formValues.question,
    formValues.comment,
    formValues.ifyes,
    formValues.ifno,
    formValues.mother,
    formValues.motherQbool,
  );

  const { comment, text: question, ifyes, ifno } = entity.data;
  const showResultAndForm = formValues.motherQbool !== 0;
  const chosenQbool = [false, null, true][formValues.motherQbool + 1];

  return (
    <div>
      <Grid container alignItems='center' justifyContent='center' direction='column'>
        <Grid item>{comment}</Grid>
        <Grid item>{question}</Grid>
        {showResultAndForm ? <Grid item>&gt; {chosenQbool ? 'yes' : 'no'}</Grid> : ''}
        {showResultAndForm ? <Grid item>{chosenQbool ? ifyes : ifno}</Grid> : ''}
      </Grid>

      <form onSubmit={handleSubmit}>
        <Grid container alignItems='center' justifyContent='center' direction='column'>
          {(!showResultAndForm || preview) && question ? (
            <Grid item>
              <div style={{ width: '100px' }}>
                <Slider
                  value={formValues.motherQbool}
                  onChange={handleSliderChange('motherQbool')}
                  defaultValue={0}
                  step={1}
                  min={-1}
                  max={1}
                  marks={[
                    {
                      value: -1,
                      label: 'No',
                    },
                    {
                      value: 0,
                      label: '?',
                    },
                    {
                      value: 1,
                      label: 'Yes',
                    },
                  ]}
                  valueLabelDisplay='off'
                  track={false}
                />
              </div>
            </Grid>
          ) : (
            ''
          )}

          {showResultAndForm && !preview ? (
            <>
              <Grid item>
                <TextField
                  id='mother'
                  name='mother'
                  label='Mother'
                  type='number'
                  value={formValues.mother}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item>
                <TextField
                  id='comment'
                  name='comment'
                  label='Comment'
                  type='textarea'
                  value={formValues.comment}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item>
                <TextField
                  id='question'
                  name='question'
                  label='Question'
                  type='text'
                  value={formValues.question}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item>
                <TextField
                  id='ifyes'
                  name='ifyes'
                  label='If "Yes"...'
                  type='textarea'
                  value={formValues.ifyes}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item>
                <TextField
                  id='ifno'
                  name='ifno'
                  label='If "No"...'
                  type='textarea'
                  value={formValues.ifno}
                  onChange={handleInputChange}
                />
              </Grid>

              <Button variant='contained' color='primary' type='submit'>
                Submit
              </Button>
            </>
          ) : (
            ''
          )}
        </Grid>
      </form>

      {!preview ? <Form preview entity={previewEntity} /> : ''}
    </div>
  );
};

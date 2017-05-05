import DataHandler from '../utils/DataHandler';

const LibName = 'NVD3';

let dataHandlers = {
  /**
   * Transform a array of objects into a datum ready
   * to be consumed by nvd3 chars which supports
   * multiple series like linecharts and multibarcharts.
   *
   * Example:
   * {
   *   name:'fieldsToSeries',
   *   fields: [
   *     {name: 'Price', field: 'price', color:'#FF0000'},
   *   ]
   * }
   */
  fieldsToSeries: function (componentData, dashboardData, handler, e, appliedFilters, pipelineData) {
    let _data = componentData || pipelineData;
    if(!_data.length) return [];
    let series = (handler.fields || []).map( (s) => {
      let serie = {
        key: s.name,
        color: s.color
      };
      serie.values = _data.map( (row) => {
        return {y: row[s.field], x: row[(this.props.settings.x || 'x' )]};
      });
      console.log('fTS', series);
      return serie;
    });
    return series;
  },

  /**
   * Convert componentData to series format expected by NVD3 (no pie-) charts
   * Should provide a number of series objects equal to the numbers of series
   * present in the data
   *
   * Example:
   * {
   *   name: 'returnChartSeries',
   *   series: [
   *    {name: MySeries, color: blue}
   *   ]
   * }
   *
   */
  returnChartSeries: function (componentData, dashboardData, handler, e, appliedFilters, pipelineData) {
    let _data = pipelineData || componentData;
    if (!Array.isArray(_data[0])) _data = [_data]; // series data should be an array of array(s)
    if(!_data.length) return [];
    let series = (handler.series || []).map( (s,i) => {
      let serie = {
        key: s.name,
        color: s.color
      };
      serie.values = _data[i];
      return serie;
    });
    return series;
  },

  // @@TODO - move to dataHandlers/common ?
  /**
   * Parse a field as a date.
   * handler = {
   *   field: 'field_name_to_parse',
   *   name: 'parseFieldDate'
   * }
   */
  parseDateField: function (componentData, dashboardData, handler, e, appliedFilters, pipelineData) {
    let _data = pipelineData || componentData;
    return _data.map((row) => {
      row[handler.field] = Date.parse(row[handler.field]);
      return row;
    });
  },

  // NVD3 Pie charts need a different shape for data - make it so
  toPieChartSeries: function (componentData, dashboardData, handler, e, appliedFilters, pipelineData) {
    let data = pipelineData || componentData;
    if (data.length > 0) {
      return data[0];
    }
    return [];
  },
}

DataHandler.setLib('NVD3', dataHandlers);

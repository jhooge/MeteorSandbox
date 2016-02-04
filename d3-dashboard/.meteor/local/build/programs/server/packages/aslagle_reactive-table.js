(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var MongoInternals = Package.mongo.MongoInternals;
var Mongo = Package.mongo.Mongo;
var check = Package.check.check;
var Match = Package.check.Match;

/* Package-scope variables */
var getFilterQuery, ReactiveTable, dependOnFilters, getFilterStrings, getFilterFields;

(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/aslagle_reactive-table/lib/filter.js                                                                       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var parseFilterString = function (filterString) {                                                                      // 1
  var startQuoteRegExp = /^[\'\"]/;                                                                                    // 2
  var endQuoteRegExp = /[\'\"]$/;                                                                                      // 3
  var filters = [];                                                                                                    // 4
  var words = filterString.split(' ');                                                                                 // 5
                                                                                                                       // 6
  var inQuote = false;                                                                                                 // 7
  var quotedWord = '';                                                                                                 // 8
  _.each(words, function (word) {                                                                                      // 9
    if (inQuote) {                                                                                                     // 10
      if (endQuoteRegExp.test(word)) {                                                                                 // 11
        filters.push(quotedWord + ' ' + word.slice(0, word.length - 1));                                               // 12
        inQuote = false;                                                                                               // 13
        quotedWord = '';                                                                                               // 14
      } else {                                                                                                         // 15
        quotedWord = quotedWord + ' ' + word;                                                                          // 16
      }                                                                                                                // 17
    } else if (startQuoteRegExp.test(word)) {                                                                          // 18
      if (endQuoteRegExp.test(word)) {                                                                                 // 19
        filters.push(word.slice(1, word.length - 1));                                                                  // 20
      } else {                                                                                                         // 21
        inQuote = true;                                                                                                // 22
        quotedWord = word.slice(1, word.length);                                                                       // 23
      }                                                                                                                // 24
    } else {                                                                                                           // 25
      filters.push(word);                                                                                              // 26
    }                                                                                                                  // 27
  });                                                                                                                  // 28
  return filters;                                                                                                      // 29
};                                                                                                                     // 30
                                                                                                                       // 31
var escapeRegex = function(text) {                                                                                     // 32
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");                                                             // 33
};                                                                                                                     // 34
                                                                                                                       // 35
var getFieldMatches = function (field) {                                                                               // 36
  var fieldMatches = [];                                                                                               // 37
  var keys = field.split('.');                                                                                         // 38
  var previousKeys = '';                                                                                               // 39
  _.each(keys, function (key) {                                                                                        // 40
    fieldMatches.push(previousKeys + key);                                                                             // 41
    previousKeys += key + '.';                                                                                         // 42
  });                                                                                                                  // 43
  return fieldMatches;                                                                                                 // 44
};                                                                                                                     // 45
                                                                                                                       // 46
getFilterQuery = function (filterInputs, filterFields, settings) {                                                     // 47
  settings = settings || {};                                                                                           // 48
  if (settings.enableRegex === undefined) {                                                                            // 49
    settings.enableRegex = false;                                                                                      // 50
  }                                                                                                                    // 51
  if (settings.filterOperator === undefined) {                                                                         // 52
    settings.filterOperator = "$and";                                                                                  // 53
  }                                                                                                                    // 54
  if (settings.fields) {                                                                                               // 55
    _.each(filterInputs, function (filter, index) {                                                                    // 56
      if (_.any(settings.fields, function (include) { return include; })) {                                            // 57
        filterFields[index] = _.filter(filterFields[index], function (field) {                                         // 58
          return _.any(getFieldMatches(field), function (fieldMatch) {                                                 // 59
            return settings.fields[fieldMatch];                                                                        // 60
          });                                                                                                          // 61
        });                                                                                                            // 62
      } else {                                                                                                         // 63
        filterFields[index] = _.filter(filterFields[index], function (field) {                                         // 64
          return _.all(getFieldMatches(field), function (fieldMatch) {                                                 // 65
            return _.isUndefined(settings.fields[fieldMatch]) || settings.fields[fieldMatch];                          // 66
          });                                                                                                          // 67
        });                                                                                                            // 68
      }                                                                                                                // 69
    });                                                                                                                // 70
  }                                                                                                                    // 71
  var numberRegExp = /^\d+$/;                                                                                          // 72
  var queryList = [];                                                                                                  // 73
  _.each(filterInputs, function (filter, index) {                                                                      // 74
    if (filter) {                                                                                                      // 75
      if (_.isObject(filter)) {                                                                                        // 76
        var fieldQueries = _.map(filterFields[index], function (field) {                                               // 77
          var query = {};                                                                                              // 78
          query[field] = filter;                                                                                       // 79
          return query;                                                                                                // 80
        });                                                                                                            // 81
        if (fieldQueries.length) {                                                                                     // 82
            queryList.push({'$or': fieldQueries});                                                                     // 83
          }                                                                                                            // 84
      } else {                                                                                                         // 85
        var filters = parseFilterString(filter);                                                                       // 86
        _.each(filters, function (filterWord) {                                                                        // 87
          if (settings.enableRegex === false) {                                                                        // 88
            filterWord = escapeRegex(filterWord);                                                                      // 89
          }                                                                                                            // 90
          var filterQueryList = [];                                                                                    // 91
          _.each(filterFields[index], function (field) {                                                               // 92
            var filterRegExp = new RegExp(filterWord, 'i');                                                            // 93
            var query = {};                                                                                            // 94
            query[field] = filterRegExp;                                                                               // 95
            filterQueryList.push(query);                                                                               // 96
                                                                                                                       // 97
            if (numberRegExp.test(filterWord)) {                                                                       // 98
              var numberQuery = {};                                                                                    // 99
              numberQuery[field] = parseInt(filterWord, 10);                                                           // 100
              filterQueryList.push(numberQuery);                                                                       // 101
            }                                                                                                          // 102
                                                                                                                       // 103
            if (filterWord === "true") {                                                                               // 104
              var boolQuery = {};                                                                                      // 105
              boolQuery[field] = true;                                                                                 // 106
              filterQueryList.push(boolQuery);                                                                         // 107
            } else if (filterWord === "false") {                                                                       // 108
              var boolQuery = {};                                                                                      // 109
              boolQuery[field] = false;                                                                                // 110
              filterQueryList.push(boolQuery);                                                                         // 111
            }                                                                                                          // 112
          });                                                                                                          // 113
                                                                                                                       // 114
          if (filterQueryList.length) {                                                                                // 115
            var filterQuery = {'$or': filterQueryList};                                                                // 116
            queryList.push(filterQuery);                                                                               // 117
          }                                                                                                            // 118
        });                                                                                                            // 119
      }                                                                                                                // 120
    }                                                                                                                  // 121
  });                                                                                                                  // 122
                                                                                                                       // 123
  var query = {};                                                                                                      // 124
                                                                                                                       // 125
  if(queryList.length) {                                                                                               // 126
    query[settings.filterOperator] = queryList;                                                                        // 127
  }                                                                                                                    // 128
                                                                                                                       // 129
  return query;                                                                                                        // 130
};                                                                                                                     // 131
                                                                                                                       // 132
if (Meteor.isClient) {                                                                                                 // 133
  ReactiveTable = ReactiveTable || {};                                                                                 // 134
                                                                                                                       // 135
  var reactiveTableFilters = {};                                                                                       // 136
  var callbacks = {};                                                                                                  // 137
                                                                                                                       // 138
  ReactiveTable.Filter = function (id, fields) {                                                                       // 139
    if (reactiveTableFilters[id]) {                                                                                    // 140
        return reactiveTableFilters[id];                                                                               // 141
    }                                                                                                                  // 142
                                                                                                                       // 143
    var filter = new ReactiveVar();                                                                                    // 144
                                                                                                                       // 145
    this.fields = fields;                                                                                              // 146
                                                                                                                       // 147
    this.get = function () {                                                                                           // 148
      return filter.get() || '';                                                                                       // 149
    };                                                                                                                 // 150
                                                                                                                       // 151
    this.set = function (filterString) {                                                                               // 152
      filter.set(filterString);                                                                                        // 153
      _.each(callbacks[id], function (callback) {                                                                      // 154
        callback();                                                                                                    // 155
      });                                                                                                              // 156
    };                                                                                                                 // 157
                                                                                                                       // 158
    reactiveTableFilters[id] = this;                                                                                   // 159
  };                                                                                                                   // 160
                                                                                                                       // 161
  ReactiveTable.clearFilters = function (filterIds) {                                                                  // 162
    _.each(filterIds, function (filterId) {                                                                            // 163
      if (reactiveTableFilters[filterId]) {                                                                            // 164
        reactiveTableFilters[filterId].set('');                                                                        // 165
      }                                                                                                                // 166
    });                                                                                                                // 167
  };                                                                                                                   // 168
                                                                                                                       // 169
  dependOnFilters = function (filterIds, callback) {                                                                   // 170
    _.each(filterIds, function (filterId) {                                                                            // 171
      if (_.isUndefined(callbacks[filterId])) {                                                                        // 172
        callbacks[filterId] = [];                                                                                      // 173
      }                                                                                                                // 174
      callbacks[filterId].push(callback);                                                                              // 175
    });                                                                                                                // 176
  };                                                                                                                   // 177
                                                                                                                       // 178
  getFilterStrings = function (filterIds) {                                                                            // 179
    return _.map(filterIds, function (filterId) {                                                                      // 180
      if (_.isUndefined(reactiveTableFilters[filterId])) {                                                             // 181
        return '';                                                                                                     // 182
      }                                                                                                                // 183
      return reactiveTableFilters[filterId].get();                                                                     // 184
    });                                                                                                                // 185
  };                                                                                                                   // 186
                                                                                                                       // 187
  getFilterFields = function (filterIds, allFields) {                                                                  // 188
    return _.map(filterIds, function (filterId) {                                                                      // 189
      if (_.isUndefined(reactiveTableFilters[filterId])) {                                                             // 190
        return _.map(allFields, function (field) { return field.key; });                                               // 191
      } else if (_.isEmpty(reactiveTableFilters[filterId].fields)) {                                                   // 192
        return _.map(allFields, function (field) { return field.key; });                                               // 193
      } else {                                                                                                         // 194
        return reactiveTableFilters[filterId].fields;                                                                  // 195
      }                                                                                                                // 196
    });                                                                                                                // 197
  };                                                                                                                   // 198
                                                                                                                       // 199
  Template.reactiveTableFilter.helpers({                                                                               // 200
    'class': function () {                                                                                             // 201
      return this.class || 'input-group';                                                                              // 202
    },                                                                                                                 // 203
                                                                                                                       // 204
    'filter': function () {                                                                                            // 205
      if (_.isUndefined(reactiveTableFilters[this.id])) {                                                              // 206
        new ReactiveTable.Filter(this.id, this.fields);                                                                // 207
      }                                                                                                                // 208
      return reactiveTableFilters[this.id].get();                                                                      // 209
    }                                                                                                                  // 210
  });                                                                                                                  // 211
                                                                                                                       // 212
  var updateFilter = _.debounce(function (template, filterText) {                                                      // 213
    reactiveTableFilters[template.data.id].set(filterText);                                                            // 214
  }, 200);                                                                                                             // 215
                                                                                                                       // 216
  Template.reactiveTableFilter.events({                                                                                // 217
    'keyup .reactive-table-input, input .reactive-table-input': function (event) {                                     // 218
      var template = Template.instance();                                                                              // 219
      var filterText = $(event.target).val();                                                                          // 220
      updateFilter(template, filterText);                                                                              // 221
    },                                                                                                                 // 222
  });                                                                                                                  // 223
}                                                                                                                      // 224
                                                                                                                       // 225
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/aslagle_reactive-table/lib/server.js                                                                       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
ReactiveTable = {};                                                                                                    // 1
                                                                                                                       // 2
ReactiveTable.publish = function (name, collectionOrFunction, selectorOrFunction, settings) {                          // 3
    Meteor.publish("reactive-table-" + name, function (publicationId, filters, fields, options, rowsPerPage) {         // 4
      check(publicationId, String);                                                                                    // 5
      check(filters, [Match.OneOf(String, Object, Mongo.ObjectID)]);                                                   // 6
      check(fields, [[String]]);                                                                                       // 7
      check(options, {skip: Match.Integer, limit: Match.Integer, sort: Object});                                       // 8
      check(rowsPerPage, Match.Integer);                                                                               // 9
                                                                                                                       // 10
      var collection;                                                                                                  // 11
      var selector;                                                                                                    // 12
                                                                                                                       // 13
      if (_.isFunction(collectionOrFunction)) {                                                                        // 14
        collection = collectionOrFunction.call(this);                                                                  // 15
      } else {                                                                                                         // 16
        collection = collectionOrFunction;                                                                             // 17
      }                                                                                                                // 18
                                                                                                                       // 19
      if (!(collection instanceof Mongo.Collection)) {                                                                 // 20
        console.log("ReactiveTable.publish: no collection to publish");                                                // 21
        return [];                                                                                                     // 22
      }                                                                                                                // 23
                                                                                                                       // 24
      if (_.isFunction(selectorOrFunction)) {                                                                          // 25
        selector = selectorOrFunction.call(this);                                                                      // 26
      } else {                                                                                                         // 27
        selector = selectorOrFunction;                                                                                 // 28
      }                                                                                                                // 29
      var self = this;                                                                                                 // 30
      var filterQuery = _.extend(getFilterQuery(filters, fields, settings), selector);                                 // 31
      if (settings && settings.fields) {                                                                               // 32
        options.fields = settings.fields;                                                                              // 33
      }                                                                                                                // 34
      var pageCursor = collection.find(filterQuery, options);                                                          // 35
      var fullCursor = collection.find(filterQuery);                                                                   // 36
      var count = fullCursor.count();                                                                                  // 37
                                                                                                                       // 38
      var getRow = function (row, index) {                                                                             // 39
        return _.extend({                                                                                              // 40
          "reactive-table-id": publicationId,                                                                          // 41
          "reactive-table-sort": index                                                                                 // 42
        }, row);                                                                                                       // 43
      };                                                                                                               // 44
                                                                                                                       // 45
      var getRows = function () {                                                                                      // 46
        return _.map(pageCursor.fetch(), getRow);                                                                      // 47
      };                                                                                                               // 48
      var rows = {};                                                                                                   // 49
      _.each(getRows(), function (row) {                                                                               // 50
        rows[row._id] = row;                                                                                           // 51
      });                                                                                                              // 52
                                                                                                                       // 53
      var updateRows = function () {                                                                                   // 54
        var newRows = getRows();                                                                                       // 55
        _.each(newRows, function (row, index) {                                                                        // 56
          var oldRow = rows[row._id];                                                                                  // 57
          if (oldRow) {                                                                                                // 58
            if (!_.isEqual(oldRow, row)) {                                                                             // 59
              self.changed("reactive-table-rows-" + publicationId, row._id, row);                                      // 60
              rows[row._id] = row;                                                                                     // 61
            }                                                                                                          // 62
          } else {                                                                                                     // 63
            self.added("reactive-table-rows-" + publicationId, row._id, row);                                          // 64
            rows[row._id] = row;                                                                                       // 65
          }                                                                                                            // 66
        });                                                                                                            // 67
      };                                                                                                               // 68
                                                                                                                       // 69
      self.added("reactive-table-counts", publicationId, {count: count});                                              // 70
      _.each(rows, function (row) {                                                                                    // 71
        self.added("reactive-table-rows-" + publicationId, row._id, row);                                              // 72
      });                                                                                                              // 73
                                                                                                                       // 74
      var initializing = true;                                                                                         // 75
                                                                                                                       // 76
      var handle = pageCursor.observeChanges({                                                                         // 77
        added: function (id, fields) {                                                                                 // 78
          if (!initializing) {                                                                                         // 79
            updateRows();                                                                                              // 80
          }                                                                                                            // 81
        },                                                                                                             // 82
                                                                                                                       // 83
        removed: function (id, fields) {                                                                               // 84
          self.removed("reactive-table-rows-" + publicationId, id);                                                    // 85
          delete rows[id];                                                                                             // 86
          updateRows();                                                                                                // 87
        },                                                                                                             // 88
                                                                                                                       // 89
        changed: function (id, fields) {                                                                               // 90
          updateRows();                                                                                                // 91
        }                                                                                                              // 92
                                                                                                                       // 93
      });                                                                                                              // 94
                                                                                                                       // 95
      var countHandle = fullCursor.observeChanges({                                                                    // 96
          added: function (id, fields) {                                                                               // 97
              if (!initializing) {                                                                                     // 98
                  self.changed("reactive-table-counts", publicationId, {count: fullCursor.count()});                  
              }                                                                                                        // 100
          },                                                                                                           // 101
                                                                                                                       // 102
          removed: function (id, fields) {                                                                             // 103
              self.changed("reactive-table-counts", publicationId, {count: fullCursor.count()});                       // 104
          }                                                                                                            // 105
      });                                                                                                              // 106
      initializing = false;                                                                                            // 107
                                                                                                                       // 108
      self.ready();                                                                                                    // 109
                                                                                                                       // 110
      self.onStop(function () {                                                                                        // 111
        handle.stop();                                                                                                 // 112
        countHandle.stop();                                                                                            // 113
      });                                                                                                              // 114
    });                                                                                                                // 115
};                                                                                                                     // 116
                                                                                                                       // 117
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['aslagle:reactive-table'] = {
  ReactiveTable: ReactiveTable
};

})();

//# sourceMappingURL=aslagle_reactive-table.js.map

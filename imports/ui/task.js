import { Template }
from 'meteor/templating';

import { TasksCollection }
from '../api/tasksCollection';

Template.mainContainer.events({

  'click .delete'() {

    TasksCollection.remove(this._id);

  },

  'click .toggle-checked'() {

    TasksCollection.update(this._id, {

      $set: {

        checked: !this.checked

      }

    });

  }

});
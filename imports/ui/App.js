import './App.html';

import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import Sortable from 'sortablejs';

const tasks = new ReactiveVar([]);

const selectedCategory =
new ReactiveVar('All');

let nextId = 1;

Template.mainContainer.helpers({

  tasks() {

    const currentTasks =
    tasks.get();

    const filter =
    selectedCategory.get();

    if (filter === 'All') {

      return currentTasks;

    }

    return currentTasks.filter(task =>

      task.category === filter

    );

  },

  isSelected(category) {

    return selectedCategory.get()
    === category;

  }

});

Template.mainContainer.events({

  'submit .task-form'(event) {

    event.preventDefault();

    const text =
    event.target.text.value;

    const category =
    event.target.category.value;

    const currentTasks =
    [...tasks.get()];

    currentTasks.push({

      _id: nextId++,

      text: text,

      category: category,

      completed: false

    });

    tasks.set([...currentTasks]);

    event.target.text.value = '';

  },

  'click .filter-btn'(event) {

    const category =
    event.currentTarget.dataset.category;

    selectedCategory.set(category);

  },

  'click .delete-btn'(event) {

    const id =
    Number(event.currentTarget.dataset.id);

    const currentTasks =
    tasks.get().filter(task =>

      task._id !== id

    );

    tasks.set([...currentTasks]);

  },

  'change .complete-checkbox'(event) {

    const id =
    Number(event.currentTarget.dataset.id);

    const currentTasks =
    [...tasks.get()];

    const task =
    currentTasks.find(task =>

      task._id === id

    );

    if (task) {

      task.completed =
      !task.completed;

    }

    tasks.set([...currentTasks]);

  }

});

Template.mainContainer.onRendered(function () {

  const el =
  document.getElementById('task-list');

  Sortable.create(el, {

    animation: 200,

    ghostClass: 'dragging',

    onEnd(event) {

      const currentTasks =
      [...tasks.get()];

      const movedItem =
      currentTasks.splice(
        event.oldIndex,
        1
      )[0];

      currentTasks.splice(
        event.newIndex,
        0,
        movedItem
      );

      tasks.set([]);

      setTimeout(() => {

        tasks.set([...currentTasks]);

      }, 0);

    }

  });

});
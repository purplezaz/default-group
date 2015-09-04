import Modal from 'flarum/components/Modal';
import Group from 'flarum/models/Group';
import Button from 'flarum/components/Button';
import saveConfig from 'flarum/utils/saveConfig';
import Dropdown from 'flarum/components/Dropdown';
import GroupBadge from 'flarum/components/GroupBadge';

export default class DefaultGroupSettingsModal extends Modal {
  constructor(...args) {
    super(...args);

    const user = app.session.user;

    this.defaultGroup = m.prop(app.config['hyn.default_group.group'] || '');
    //this.group = app.store.all('groups').findById(this.defaultGroup);
    this.groups = {};
    app.store.all('groups')
        .filter(group => [Group.GUEST_ID].indexOf(group.id()) === -1)
        .map(group => Button.component({
              children: [GroupBadge.component({group, label: null}), ' ', group.namePlural()],
              icon: group.id() == this.defaultGroup ? 'check' : true,
              onclick: (e) => {
                e.stopPropagation();
                this.toggle(group.id());
              }
        }));
  }

  className() {
    return 'DefaultGroupSettingsModal Modal--small';
  }

  title() {
    return 'Default group Settings';
  }

  content() {
    return (
      <div className="Modal-body">
        <div className="Form">


          <div className="Form-group">
            <label>Default group</label>
            <div className="Form-group">
              {Dropdown.component({
                  key: 'default_group',
                  children: [this.groups]
              })}

            </div>
          </div>

          <div className="Form-group">
            {Button.component({
              type: 'submit',
              className: 'Button Button--primary DefaultGroupSettingsModal-save',
              loading: this.loading,
              children: 'Save Changes'
            })}
          </div>
        </div>
      </div>
    );
  }

  onsubmit(e) {
    e.preventDefault();

    this.loading = true;

    saveConfig({
      'hyn.default_group.group': this.defaultGroup()
    }).then(
      () => this.hide(),
      () => {
        this.loading = false;
        m.redraw();
      }
    );
  }
}

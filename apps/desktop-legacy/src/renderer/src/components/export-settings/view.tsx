import ExportSettingsForm from './form';
import Presets from './presets';

function ExportSettingsView() {
  return (
    <div className="mb-5 flex flex-col md:flex-row justify-start items-stretch gap-5">
      <ExportSettingsForm>
        <Presets />
      </ExportSettingsForm>
    </div>
  );
}

export default ExportSettingsView;

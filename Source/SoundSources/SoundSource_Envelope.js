
class SoundSource_Envelope
{
	constructor
	(
		ticksPerSecond,
		attackDurationInTicks,
		decayDurationInTicks,
		sustainDurationInTicks,
		sustainAmplitudeMultiplier,
		releaseDurationInTicks,
		child
	)
	{
		this.typeName = SoundSourceType.Instances().Envelope.name;

		this.ticksPerSecond = ticksPerSecond;
		this.attackDurationInTicks = attackDurationInTicks;
		this.decayDurationInTicks = decayDurationInTicks;
		this.sustainDurationInTicks = sustainDurationInTicks;
		this.sustainAmplitudeMultiplier = sustainAmplitudeMultiplier;
		this.releaseDurationInTicks = releaseDurationInTicks;
		this.child = child;
	}

	static default()
	{
		return new SoundSource_Envelope
		(
			1000, // ticksPerSecond
			100, // attackDurationInTicks
			200, // decayDurationInTicks
			500, // sustainDurationInTicks
			.5, // sustainAmplitudeMultiplier
			200, // releaseDurationInTicks
			new SoundSource(new SoundSource_Silence())
		);
	}

	sampleForFrequencyAndTime(frequencyInHertz, timeInSeconds)
	{
		var amplitudeMultiplier;

		var timeInTicks = timeInSeconds * this.ticksPerSecond;
		if (timeInTicks < this.attackDurationInTicks)
		{
			amplitudeMultiplier = timeInTicks / this.attackDurationInTicks;
		}
		else
		{
			timeInTicks -= this.attackDurationInTicks;
			if (timeInTicks < this.decayDurationInTicks)
			{
				var decayProgress = timeInTicks / this.decayDurationInTicks;
				var decayAmplitudeChange = 1 - this.sustainAmplitudeMultiplier;
				amplitudeMultiplier =
					this.sustainAmplitudeMultiplier
					+ decayAmplitudeChange * (1 - decayProgress);
			}
			else
			{
				timeInTicks -= this.decayDurationInTicks;
				if (timeInTicks < this.sustainDurationInTicks)
				{
					amplitudeMultiplier = this.sustainAmplitudeMultiplier;
				}
				else
				{
					timeInTicks -= this.sustainDurationInTicks;
					if (timeInTicks < this.releaseDurationInTicks)
					{
						var releaseProgress = timeInTicks / this.releaseDurationInTicks;
						amplitudeMultiplier =
							this.sustainAmplitudeMultiplier
							* (1 - releaseProgress)
					}
					else
					{
						amplitudeMultiplier = 0;
					}
				}
			}
		}

		var sampleFromChild =
			this.child.sampleForFrequencyAndTime(frequencyInHertz, timeInSeconds);

		var returnValue = sampleFromChild * amplitudeMultiplier;

		return returnValue;
	}

	// ui

	uiClear()
	{
		delete this.divSoundSource;
		delete this.inputAttackDurationInTicks;
		delete this.inputDecayDurationInTicks;
		delete this.inputSustainDurationInTicks;
		delete this.inputSustainAmplitudeMultiplier;
		delete this.inputReleaseDurationInTicks;
		this.child.uiClear();
	}

	uiUpdate()
	{
		var soundSource = this;
		var d = document;

		if (this.divSoundSource == null)
		{
			this.divSoundSource = d.createElement("div");

			var labelChild = d.createElement("label");
			labelChild.innerText = "Child:";
			this.divSoundSource.appendChild(labelChild);

			var divChild = d.createElement("div");
			this.divSoundSource.appendChild(divChild);
			this.divChild = divChild;

			var childAsDiv = this.child.uiUpdate();
			this.divChild.appendChild(childAsDiv);

			var labelTicksPerSecond = d.createElement("label");
			labelTicksPerSecond.innerText = "Ticks per Second:";
			this.divSoundSource.appendChild(labelTicksPerSecond);
			var inputTicksPerSecond = d.createElement("input");
			inputTicksPerSecond.type = "number";
			inputTicksPerSecond.style.width = "64px";
			inputTicksPerSecond.onchange = function(event)
			{
				soundSource.ticksPerSecond = parseInt(inputTicksPerSecond.value);
			}
			this.divSoundSource.appendChild(inputTicksPerSecond);
			this.divSoundSource.appendChild(d.createElement("br"));
			this.inputTicksPerSecond = inputTicksPerSecond;

			var labelAttackDurationInTicks = d.createElement("label");
			labelAttackDurationInTicks.innerText = "Attack Duration in Ticks:";
			this.divSoundSource.appendChild(labelAttackDurationInTicks);
			var inputAttackDurationInTicks = d.createElement("input");
			inputAttackDurationInTicks.type = "number";
			inputAttackDurationInTicks.style.width = "64px";
			inputAttackDurationInTicks.onchange = function(event)
			{
				soundSource.attackDurationInTicks = parseInt(inputAttackDurationInTicks.value);
			}
			this.divSoundSource.appendChild(inputAttackDurationInTicks);
			this.divSoundSource.appendChild(d.createElement("br"));
			this.inputAttackDurationInTicks = inputAttackDurationInTicks;

			var labelDecayDurationInTicks = d.createElement("label");
			labelDecayDurationInTicks.innerText = "Decay Duration in Ticks:";
			this.divSoundSource.appendChild(labelDecayDurationInTicks);
			var inputDecayDurationInTicks = d.createElement("input");
			inputDecayDurationInTicks.type = "number";
			inputDecayDurationInTicks.style.width = "64px";
			inputDecayDurationInTicks.onchange = function(event)
			{
				soundSource.decayDurationInTicks = parseInt(inputDecayDurationInTicks.value);
			}
			this.divSoundSource.appendChild(inputDecayDurationInTicks);
			this.divSoundSource.appendChild(d.createElement("br"));
			this.inputDecayDurationInTicks = inputDecayDurationInTicks;

			var labelSustainDurationInTicks = d.createElement("label");
			labelSustainDurationInTicks.innerText = "Sustain Duration in Ticks:";
			this.divSoundSource.appendChild(labelSustainDurationInTicks);
			var inputSustainDurationInTicks = d.createElement("input");
			inputSustainDurationInTicks.type = "number";
			inputSustainDurationInTicks.style.width = "64px";
			inputSustainDurationInTicks.onchange = function(event)
			{
				soundSource.sustainDurationInTicks = parseInt(inputSustainDurationInTicks.value);
			}
			this.divSoundSource.appendChild(inputSustainDurationInTicks);
			this.divSoundSource.appendChild(d.createElement("br"));
			this.inputSustainDurationInTicks = inputSustainDurationInTicks;

			var labelSustainAmplitudeMultiplier = d.createElement("label");
			labelSustainAmplitudeMultiplier.innerText = "Sustain Amplitude Multiplier:";
			this.divSoundSource.appendChild(labelSustainAmplitudeMultiplier);
			var inputSustainAmplitudeMultiplier = d.createElement("input");
			inputSustainAmplitudeMultiplier.type = "number";
			inputSustainAmplitudeMultiplier.style.width = "64px";
			inputSustainAmplitudeMultiplier.onchange = function(event)
			{
				soundSource.sustainAmplitudeMultiplier = parseFloat(inputSustainAmplitudeMultiplier.value);
			}

			this.divSoundSource.appendChild(inputSustainAmplitudeMultiplier);
			this.divSoundSource.appendChild(d.createElement("br"));
			this.inputSustainAmplitudeMultiplier = inputSustainAmplitudeMultiplier;

			var labelReleaseDurationInTicks = d.createElement("label");
			labelReleaseDurationInTicks.innerText = "Release Duration in Ticks:";
			this.divSoundSource.appendChild(labelReleaseDurationInTicks);
			var inputReleaseDurationInTicks = d.createElement("input");
			inputReleaseDurationInTicks.type = "number";
			inputReleaseDurationInTicks.style.width = "64px";
			inputReleaseDurationInTicks.onchange = function(event)
			{
				soundSource.releaseDurationInTicks = parseInt(inputReleaseDurationInTicks.value);
			}

			this.divSoundSource.appendChild(inputReleaseDurationInTicks);
			this.divSoundSource.appendChild(d.createElement("br"));
			this.inputReleaseDurationInTicks = inputReleaseDurationInTicks;
		}
		else
		{
			this.inputTicksPerSecond.value = this.ticksPerSecond;
			this.inputAttackDurationInTicks.value = this.attackDurationInTicks;
			this.inputDecayDurationInTicks.value = this.decayDurationInTicks;
			this.inputSustainDurationInTicks.value = this.sustainDurationInTicks;
			this.inputSustainAmplitudeMultiplier.value = this.sustainAmplitudeMultiplier;
			this.inputReleaseDurationInTicks.value = this.releaseDurationInTicks;

			this.child.uiUpdate();
		}

		return this.divSoundSource;
	}
}

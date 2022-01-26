using FluentAssertions;
using NUnit.Framework;
using System;

namespace GameTracker.Tests
{
	[TestFixture]
	public class TimeSpanExtensionsTests
	{
		[Test]
		public void ShouldReturn0SecondsWhenLessThanOneSecond()
		{
			TimeSpan.FromMilliseconds(1).HumanReadable().Should().Be("0 seconds");
			TimeSpan.FromMilliseconds(999).HumanReadable().Should().Be("0 seconds");
		}

		[Test]
		public void ShouldReturnTimeSpanInSecondsWhenLessThanMaximumSecondsValue()
		{
			TimeSpan.FromSeconds(1).HumanReadable().Should().Be("1 second");
			TimeSpan.FromSeconds(1.5).HumanReadable().Should().Be("1 second");

			TimeSpan.FromSeconds(25).HumanReadable().Should().Be("25 seconds");
			TimeSpan.FromSeconds(25.1556).HumanReadable().Should().Be("25.16 seconds");
			TimeSpan.FromSeconds(99.99).HumanReadable().Should().Be("99.99 seconds");
		}

		[Test]
		public void ShouldReturnTimeSpanInMinutesWhenLessThanMaximumMinutesValue()
		{
			TimeSpan.FromSeconds(100).HumanReadable().Should().Be("1.67 minutes");
			TimeSpan.FromMinutes(20.54).HumanReadable().Should().Be("20.54 minutes");
			TimeSpan.FromMinutes(99.99).HumanReadable().Should().Be("99.99 minutes");
		}
	}
}

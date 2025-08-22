import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Checkbox } from 'brikui';

export default function CheckboxExamples() {
  const [terms, setTerms] = useState(true);
  const [updates, setUpdates] = useState(false);

  return (
    <ScrollView contentContainerClassName="p-4 gap-8" className="flex-1">
      <View className="gap-4">
        <Checkbox
          checked={terms}
          onCheckedChange={setTerms}
          title="Accept terms and conditions"
          description="By clicking this checkbox, you agree to the terms and conditions."
          wrapperActiveClassName="bg-accent"
          wrapperClassName="bg-card p-4 rounded-2xl"
        />
        <Checkbox
          checked={updates}
          onCheckedChange={setUpdates}
          title="Email updates"
          description="Receive occasional product news and feature updates."
        />
        <Checkbox title="Simple checkbox" />
        <Checkbox description="Description only checkbox" />
      </View>

      <View className="gap-4">
        <Checkbox disabled title="Disabled unchecked" description="Can't be toggled" />
        <Checkbox disabled defaultChecked title="Disabled checked" />
      </View>

      <View className="gap-4">
        <Checkbox size="sm" title="Small" description="sm size" defaultChecked />
        <Checkbox size="md" title="Medium" description="md (default) size" defaultChecked />
        <Checkbox size="lg" title="Large" description="lg size" defaultChecked />
      </View>
    </ScrollView>
  );
}

import React, { useState } from 'react';
import { ScrollView, View, Text } from 'react-native';
import { Pagination } from 'brikui';

export default function PaginationExamples() {
  const [page, setPage] = useState(3);

  return (
    <ScrollView contentContainerClassName="p-4 gap-8" className="flex-1">
      <View className="gap-4">
        <Text className="font-semibold">Uncontrolled</Text>
        <Pagination pageCount={12} />
      </View>

      <View className="gap-4">
        <Text className="font-semibold">Controlled</Text>
        <Pagination pageCount={20} page={page} onChange={setPage} />
        <Text>Current page: {page}</Text>
      </View>

      <View className="gap-4">
        <Text className="font-semibold">With more siblings & boundaries</Text>
        <Pagination pageCount={30} siblings={2} boundaries={2} />
      </View>

      <View className="gap-4">
        <Text className="font-semibold">No prev / next</Text>
        <Pagination pageCount={15} showPrevNext={false} />
      </View>
    </ScrollView>
  );
}

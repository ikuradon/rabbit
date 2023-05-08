import { Component } from 'solid-js';

import Bell from 'heroicons/24/outline/bell.svg';
import GlobeAlt from 'heroicons/24/outline/globe-alt.svg';
import Heart from 'heroicons/24/outline/heart.svg';
import Home from 'heroicons/24/outline/home.svg';
import User from 'heroicons/24/outline/user.svg';

import BasicModal from '@/components/modal/BasicModal';
import {
  createFollowingColumn,
  createJapanRelaysColumn,
  createNotificationColumn,
  createPostsColumn,
  createReactionsColumn,
} from '@/core/column';
import useConfig from '@/core/useConfig';
import usePubkey from '@/nostr/usePubkey';
import ensureNonNull from '@/utils/ensureNonNull';

type AddColumnProps = {
  onClose: () => void;
};

const AddColumn: Component<AddColumnProps> = (props) => {
  const pubkey = usePubkey();
  const { saveColumn } = useConfig();

  const addFollowingColumn = () => {
    ensureNonNull([pubkey()] as const)(([pubkeyNonNull]) => {
      saveColumn(createFollowingColumn({ pubkey: pubkeyNonNull }));
    });
    props.onClose();
  };

  const addNotificationColumn = () => {
    ensureNonNull([pubkey()] as const)(([pubkeyNonNull]) => {
      saveColumn(createNotificationColumn({ pubkey: pubkeyNonNull }));
    });
    props.onClose();
  };

  const addJapanRelaysColumn = () => {
    saveColumn(createJapanRelaysColumn());
    props.onClose();
  };

  const addMyPostsColumn = () => {
    ensureNonNull([pubkey()] as const)(([pubkeyNonNull]) => {
      saveColumn(createPostsColumn({ pubkey: pubkeyNonNull }));
    });
    props.onClose();
  };

  const addMyReactionsColumn = () => {
    ensureNonNull([pubkey()] as const)(([pubkeyNonNull]) => {
      saveColumn(createReactionsColumn({ pubkey: pubkeyNonNull }));
    });
    props.onClose();
  };

  return (
    <BasicModal onClose={props.onClose}>
      <div class="flex flex-wrap p-4">
        <button
          class="flex basis-1/2 flex-col items-center gap-2 py-8 sm:basis-1/4"
          onClick={() => addFollowingColumn()}
        >
          <span class="inline-block h-8 w-8">
            <Home />
          </span>
          ホーム
        </button>
        <button
          class="flex basis-1/2 flex-col items-center gap-2 py-8 sm:basis-1/4"
          onClick={() => addNotificationColumn()}
        >
          <span class="inline-block h-8 w-8">
            <Bell />
          </span>
          通知
        </button>
        <button
          class="flex basis-1/2 flex-col items-center gap-2 py-8 sm:basis-1/4"
          onClick={() => addJapanRelaysColumn()}
        >
          <span class="inline-block h-8 w-8">
            <GlobeAlt />
          </span>
          日本リレー
        </button>
        <button
          class="flex basis-1/2 flex-col items-center gap-2 py-8 sm:basis-1/4"
          onClick={() => addMyPostsColumn()}
        >
          <span class="inline-block h-8 w-8">
            <User />
          </span>
          自分の投稿
        </button>
        <button
          class="flex basis-1/2 flex-col items-center gap-2 py-8 sm:basis-1/4"
          onClick={() => addMyReactionsColumn()}
        >
          <span class="inline-block h-8 w-8">
            <Heart />
          </span>
          自分のリアクション
        </button>
      </div>
    </BasicModal>
  );
};

export default AddColumn;
